import * as toxicity from '@tensorflow-models/toxicity';

let toxicityModel;

async function loadToxicityModel() {

    toxicity.load().then((model) => {
        try {
            toxicityModel = model;
        } catch(e) {
            console.log(e);
        }
        
    }).catch((e) => {
        console.log("Error occured : ", e);
    });
}

loadToxicityModel().then(() => {
    console.log("ToxicityModel loaded");
})

export async function predictToxicElements(sentences) {

    const predictions = await toxicityModel.classify(sentences);
    const deductions = predictions.reduce((allItems, {label, results}) => {
        const labelCount = results.filter(({match}) =>  match === true).length;
        if (labelCount > 0) {
            allItems[label] = labelCount;
        }
        return allItems;
    }, {});

    return deductions;
}