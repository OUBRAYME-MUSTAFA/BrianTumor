$('#segmentation').click(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log(" it work")
        var formElement = $('#segForm')[0];
        var formData = new FormData(formElement);
        console.log("i am in seg ")
        console.log("Strat Segmentation ");
        
        setTimeout(function () {
            $.ajax({
                url: '/seg_upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
    
                success: function (response) {
                    console.log(response)
                    $.ajax({
                        url: '/get_segmented_image_json', // The Flask route to get the JSON data
                        method: 'GET',
                        success: function (response) {
                            console.log("i got the response")
                            // Parse the JSON response
                            var imageData = JSON.parse(response);
                            console.log(imageData)
                            file1 = get_file(imageData.data1)
                            file2 = get_file(imageData.data2)
                            
                            console.log(file1)
                            // saveAs(file2, imageData.filename);
                            // Now, 'file' is a File object that you can use as needed (e.g., display it in the Papaya viewer)
                            // Assuming Papaya's viewer.loadImage() function can handle the File object directly
                            // registeredViewer.viewer.loadImage(file);
                            upload_segmented(file1,file2)
                        },
                        error: function (xhr, status, error) {
                            console.error('Error fetching registered image JSON:', error);
                        }
                    });
    
                },
                error: function (xhr, status, error) {
                    // Error
                    console.log('File upload failed!');
                }
            });
                }, 9000);
        

        function upload_segmented(f1,f2) {
            // myFunction($("#Predict"));
            var filesList = new DataTransfer();
            filesList.items.add(f1);
            filesList.items.add(f2);
            
    
            var params = [];
            params["files"] = filesList.files;
            console.log("yessss i am inside of it3")
            console.log(params)
            // params["kioskMode"] = true;
            // params["orthogonal"] = true;
            // params["combineParametric"] = true;
            papaya.Container.resetViewer(0, params);
        }
        function get_file(imageData){
            // Convert the base64-encoded file data to binary data
            var binaryData = atob(imageData);

            // Convert the binary data to a Blob
            var blob = new Blob([new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))], { type: 'application/octet-stream' });

            // Create a File object (Optional: Set the desired filename for the File)
            var file_pred = new File([blob], imageData.filename, { type: 'application/octet-stream', lastModified: Date.now() });
            return file_pred
        }
        $("#swap-seg").click(function () {
            papayaContainers[0].viewer.rotateViews();

        });
});