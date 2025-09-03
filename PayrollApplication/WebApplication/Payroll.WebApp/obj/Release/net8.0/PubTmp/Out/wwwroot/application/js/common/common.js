//document.addEventListener('contextmenu', function (e) {
//    e.preventDefault();
//});

//document.addEventListener('keydown', function (e) {
//    if (e.key === 'F12' ||
//        (e.ctrlKey && e.shiftKey && e.key === 'I'.charCodeAt(0)) ||
//        (e.ctrlKey && e.key === 'U'.charCodeAt(0))) {
//        e.preventDefault();
//    }
//});

// Automatically redirect to logout after 30 minutes of inactivity
let idleTimeout = 5 * 60 * 1000; // 30 minutes in milliseconds
let timeout;

function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        window.location.href = '/Account/Logout';
    }, idleTimeout);
}

// Reset the timer on user activity
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeydown = resetTimer;



// Rohit Tiwari Note :- Wrapper function for AJAX calls to simplify the process of writing and calling AJAX.
//                      I am not use or optimize this code because I am leave the orgnaization.
//function ajaxRequest(url, data, successCallback, errorCallback) {
//    $.ajax({
//        type: 'POST',
//        url: url,
//        data: JSON.stringify(data),
//        contentType: 'application/json; charset=utf-8',
//        dataType: 'json',
//        success: function (response) {
//            if (successCallback && typeof successCallback === 'function') {
//                successCallback(response);
//            }
//        },
//        error: function (xhr, status, error) {
//            if (errorCallback && typeof errorCallback === 'function') {
//                errorCallback(xhr, status, error);
//            } else {
//                console.error('An error occurred:', error);
//            }
//        }
//    });
//}


