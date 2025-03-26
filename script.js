async function loadModel() {
    const model = await tf.loadGraphModel('model.json'); // Adjust if needed
    return model;
}

document.getElementById('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 224; // Adjust based on model input size
            canvas.height = 224;
            ctx.drawImage(img, 0, 0, 224, 224);

            const model = await loadModel();
            const tensor = tf.browser.fromPixels(canvas).toFloat().expandDims();
            const prediction = model.predict(tensor);
            const resultArray = await prediction.array();

            document.getElementById('result').textContent = "Prediction: " + JSON.stringify(resultArray);
        };
    };
    reader.readAsDataURL(file);
});
