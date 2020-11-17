function convertTo() {
    var input = document.getElementById("ti1").value;
    var output = document.getElementById("ti2");
    output.value = "";

    for (var i = 0; i < input.length; i++) {
        output.value += input[i].charCodeAt(0).toString(2) + " ";
    }

    var newOutputValue = "";

    for (var i = 0; i < output.value.length; i++) {
        if (output.value[i] == 1) {
            newOutputValue += "E";
        } else if (output.value[i] == " ") {
            newOutputValue += " ";
        } else {
            newOutputValue += "e";
        }
    }
    output.value = newOutputValue;
}

function convertFrom() {
    var input = document.getElementById("ti2").value;
    var output = document.getElementById("ti1");
    output.value = "";

    for (var i = 0; i < input.length; i++) {
        if (input[i] == "E") {
            output.value += "1";
        } else if (input[i] == "e") {
            output.value += "0";
        } else {
            output.value += " ";
        }
    }

    output.value = binaryAgent(output.value);
}

function binaryAgent(str) {
    var binString = '';

    str.split(' ').map(function (bin) {
        binString += String.fromCharCode(parseInt(bin, 2));
    });
    return binString;
}