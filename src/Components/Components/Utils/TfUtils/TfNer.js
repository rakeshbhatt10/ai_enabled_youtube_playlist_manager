import * as tf from '@tensorflow/tfjs';

import {make_sequences} from './WordProcessor';
import {tags_vocab} from './WordVocabs';

let model, emodel;
const getKey = (obj,val) => Object.keys(obj).find(key => obj[key] === val); // For getting tags by tagid


async function loadNerModel() {
    model = await tf.loadLayersModel('http://deepdivision.net/NERjs/tfjs_models/ner/model.json');
    let outputs_ = [model.output, model.getLayer("attention_vector").output];
    emodel = tf.model({inputs: model.input, outputs: outputs_});
}

loadNerModel().then(() => {
    console.log("Ner model loaded");
});

export async function predictArtist(sentence) {

    const words = sentence.split(' ');
    let sequence = make_sequences(words);
    let tensor = tf.tensor1d(sequence, 'int32').expandDims(0);
    let [predictions, attention_probs] = await emodel.predict(tensor);
    attention_probs = await attention_probs.data();

    predictions = await predictions.argMax(-1).data();
        let predictions_tags = Array();
        predictions.forEach(function(tagid) {
        predictions_tags.push(getKey(tags_vocab, tagid));
    });

    predictions = words.map((word, index) => {
        return {
            word,
            tag: predictions_tags[index],
            prob: attention_probs[index]
        }
    });

    const bper = predictions.filter(({tag}) => tag === "B-PER");
    const iper = predictions.filter(({tag}) => tag === "I-PER");

    let name = '';

    if (bper.length > 0) {
        name = bper[0].word.toLowerCase();
    }
    if (iper.length > 0) {
        name = name + ' ' + iper[0].word.toLowerCase();
    }
    if(name === '') {
        name = 'other';
    }

    return name;
}



