$(document).ready(function () {

    var file_pred;
    var imageData;

    $("#swap_slice").click(function () {
        papayaContainers[0].viewer.rotateViews();
        papayaContainers[1].viewer.rotateViews();
        papayaContainers[2].viewer.rotateViews();
    });
    $("#increase_slice").click(function () {
        // Loop through each Papaya viewer container
        for (var i = 0; i < papayaContainers.length; i++) {
            var viewer = papayaContainers[i].viewer;

            // Check if the viewer exists and has a main image
            if (viewer && viewer.mainImage) {
                // Get the current slice index
                var currentSlice = viewer.mainImage.slice;

                // Increase the slice index by 1 (you can adjust the increment as needed)
                var newSlice = currentSlice + 1;

                // Set the new slice index, ensuring it doesn't go beyond the maximum
                viewer.gotoCoordinate(newSlice, true);
            }
        }
    });


    function upload_moved(file) {
        myFunction($("#Predict"));
        var filesList = new DataTransfer();
        filesList.items.add(file);

        var params = [];
        params["files"] = filesList.files;
        console.log("yessss i am inside of it3")
        console.log(params)
        // params["kioskMode"] = true;
        // params["orthogonal"] = true;
        // params["combineParametric"] = true;
        papaya.Container.resetViewer(2, params);
    }

    $('#dd').click(function () {
        console.log('insiiiiiiiiiiiiiiiiiiiiiiiiiiiiide of download ')
        saveAs(window.file_pred, window.imageData.filename);
    });
    $('#uploadbutton').click(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        var formElement = $('#imageForm')[0];
        var formData = new FormData(formElement);
        console.log("i am here")

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,

            success: function (response) {
                $.ajax({
                    url: '/get_registered_image_json', // The Flask route to get the JSON data
                    method: 'GET',
                    success: function (response) {
                        console.log("i got the response")
                        // Parse the JSON response
                        imageData = JSON.parse(response);

                        // Convert the base64-encoded file data to binary data
                        var binaryData = atob(imageData.data);

                        // Convert the binary data to a Blob
                        var blob = new Blob([new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))], { type: 'application/octet-stream' });

                        // Create a File object (Optional: Set the desired filename for the File)
                        file_pred = new File([blob], imageData.filename, { type: 'application/octet-stream', lastModified: Date.now() });
                        console.log(file_pred)
                        // saveAs(file_pred, imageData.filename);
                        // Now, 'file' is a File object that you can use as needed (e.g., display it in the Papaya viewer)
                        // Assuming Papaya's viewer.loadImage() function can handle the File object directly
                        // registeredViewer.viewer.loadImage(file);
                        upload_moved(file_pred)
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
    });

    function handleFileSelect(evt, viewerId) {
        var params = [];
        params["files"] = evt.target.files;
        console.log(evt.target.files)
        console.log("yessss i am inside of it")
        console.log(params)
        // params["kioskMode"] = true;
        // params["orthogonal"] = true;
        // params["combineParametric"] = true;
        papaya.Container.resetViewer(viewerId, params);
    }

    function myFunction(x) {
        x.css("display", "block")
    }
    // if ("{{v1}}"!=""){
    //     console.log("noooooooonhhhe")
    //     myFunction($("#fix"));
    //     FileSelect("{{v1}}", 0)
    // }
    document.getElementById('ImageFixed').addEventListener('change', function (evt) {
        myFunction($("#fix"));
        handleFileSelect(evt, 0); // Pass viewerId 0 for the first                 
    }, false);

    document.getElementById('ImageMoving').addEventListener('change', function (evt) {
        myFunction($("#moving"));
        handleFileSelect(evt, 1); // Pass viewerId 1 for the second 

    }, false);
    // ********************************************************************************
    // ********************************************************************************
    // ********************* SEGMENTATION 
    // ********************************************************************************
    // ********************************************************************************
    // ********************************************************************************
    document.getElementById('ImageSeg').addEventListener('change', function (evt) {
        console.log("here I am  sub segmentation ")
        myFunction($("#seg"));
        handleFileSelect(evt, 0); // Pass viewerId 0 for the first                 
    }, false);
    // $('#segmentation').click(function (event) {
    //     for (let i = 9000; i >= 0; i--) {
    //         console.log(i);
    //       }
    //     event.preventDefault(); // Prevent the default form submission behavior
    //     var formElement = $('#segForm')[0];
    //     var formData = new FormData(formElement);
    //     console.log("i am in seg ")
    //     console.log("HELLO");
    //     setTimeout(function () {
    //         console.log("THIS IS");
    //     }, 2000);

    //     // $.ajax({
    //     //     url: '/seg_upload',
    //     //     type: 'POST',
    //     //     data: formData,
    //     //     processData: false,
    //     //     contentType: false,

    //     //     success: function (response) {
    //     //         // $.ajax({
    //     //         //     url: '/get_segmented_image_json', // The Flask route to get the JSON data
    //     //         //     method: 'GET',
    //     //         //     success: function (response) {
    //     //         //         console.log("i got the response")
    //     //         //         // Parse the JSON response
    //     //         //         var imageData = JSON.parse(response);

    //     //         //         // Convert the base64-encoded file data to binary data
    //     //         //         var binaryData = atob(imageData.data);

    //     //         //         // Convert the binary data to a Blob
    //     //         //         var blob = new Blob([new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))], { type: 'application/octet-stream' });

    //     //         //         // Create a File object (Optional: Set the desired filename for the File)
    //     //         //         var file_pred = new File([blob], imageData.filename, { type: 'application/octet-stream', lastModified: Date.now() });
    //     //         //         console.log(file_pred)
    //     //         //         saveAs(file_pred, imageData.filename);
    //     //         //         // Now, 'file' is a File object that you can use as needed (e.g., display it in the Papaya viewer)
    //     //         //         // Assuming Papaya's viewer.loadImage() function can handle the File object directly
    //     //         //         // registeredViewer.viewer.loadImage(file);
    //     //         //         upload_segmented(file_pred)
    //     //         //     },
    //     //         //     error: function (xhr, status, error) {
    //     //         //         console.error('Error fetching registered image JSON:', error);
    //     //         //     }
    //     //         // });

    //     //     },
    //     //     error: function (xhr, status, error) {
    //     //         // Error
    //     //         console.log('File upload failed!');
    //     //     }
    //     // });
    // });

});
