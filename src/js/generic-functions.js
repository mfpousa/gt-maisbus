function decomposeColor(col) {

    // Divide original string in r, g and b
    let colorValues = col.substr(1, col.length - 1).match(/.{2}/g);

    return {
        r: Number.parseInt('0x' + colorValues[0]),
        g: Number.parseInt('0x' + colorValues[1]),
        b: Number.parseInt('0x' + colorValues[2])
    }
}