$('#segmentation').click(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log(" it work")
        var formElement = $('#segForm')[0];
        var formData = new FormData(formElement);
        console.log("i am in seg ")
        console.log("HELLO");
        

        $.ajax({
            url: '/seg_upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,

            success: function (response) {
                console.log("I got a response ")
                // $.ajax({
                //     url: '/get_segmented_image_json', // The Flask route to get the JSON data
                //     method: 'GET',
                //     success: function (response) {
                //         console.log("i got the response")
                //         // Parse the JSON response
                //         var imageData = JSON.parse(response);

                //         // Convert the base64-encoded file data to binary data
                //         var binaryData = atob(imageData.data);

                //         // Convert the binary data to a Blob
                //         var blob = new Blob([new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))], { type: 'application/octet-stream' });

                //         // Create a File object (Optional: Set the desired filename for the File)
                //         var file_pred = new File([blob], imageData.filename, { type: 'application/octet-stream', lastModified: Date.now() });
                //         console.log(file_pred)
                //         saveAs(file_pred, imageData.filename);
                //         // Now, 'file' is a File object that you can use as needed (e.g., display it in the Papaya viewer)
                //         // Assuming Papaya's viewer.loadImage() function can handle the File object directly
                //         // registeredViewer.viewer.loadImage(file);
                //         // upload_segmented(file_pred)
                //     },
                //     error: function (xhr, status, error) {
                //         console.error('Error fetching registered image JSON:', error);
                //     }
                // });

            },
            error: function (xhr, status, error) {
                // Error
                console.log('File upload failed!');
            }
        });
    
});