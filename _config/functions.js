exports.compareTwoArray = (tableau1, tableau2) => {
    for (let i = 0; i < tableau1.length; i++)
        if (tableau2.includes(tableau1[i])) return true;
    return false;
};

exports.dataSecure = (input, type) => {
    var input;
    switch (type) {
        case "str": input = input?.toLowerCase().trim(); break
        case "int": input = input?.trim(); break
        default: input = input?.toLowerCase().trim(); break
    }
    return input;
}

exports.isEmpty = (value) => value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

exports.genRandomNums = (size) => {
    let min = Math.pow(10, size - 1);
    let max = Math.pow(10, size) - 1;
    let token = Math.floor(min + Math.random() * (max - min + 1));
    return token.toString();
}

// GENENRER UNE CHAINE DE CARATERE ALEATOIRE UNIQUE
exports.genRandomString = () => {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();
    return uniqid;
};

exports.convertOctetsToMo = (octets) => {
    const megaoctets = octets / (1024 * 1024)
    return megaoctets.toFixed(0) + ' Mo'
}

exports.removePhoneIndicatif = (numero) => {
    var number;

    if (numero.startsWith("+223")) number = numero.slice("+223".length);
    else if (numero.startsWith("00223")) number = numero.slice("00223".length);
    else number = numero
    return number
}

exports.addPhoneIndicatif = (numero) => {
    var indicatifs = ["+223", "00223"];
    var number;
    indicatifs?.forEach(indicatif => {
        if (!numero.startsWith(indicatif)) number = indicatifs[0] + numero
        else number = numero
    })
    return number
}

exports.handleChange = (e, setInputs) => {
    const { name, value } = e.target; setInputs((other) => { return { ...other, [name]: value, }; });
};

exports.handleChangeCheckbox = (e, setInputs) => {
    const { name, checked } = e.target; setInputs((other) => { return { ...other, [name]: checked, }; });
};

exports.handleChangeMobile = (key, value, setInputs) => { setInputs(prevState => ({ ...prevState, [key]: value, })) }

exports.isImage = (file) => {
    let res
    if (typeof file === "string" && (file?.split(".").includes("jpg") || file?.split(".").includes("jpeg") || file?.split(".").includes("png") || file?.split(".").includes("gif")))
        res = true
    else
        if (file?.type.split("/").includes("image") && (file?.name.endsWith(".jpg") || file?.name.endsWith(".jpeg") || file?.name.endsWith(".png") || file?.name.endsWith(".gif") || file?.name.endsWith(".bmp"))) res = true
        else res = false

    return res
}

exports.isVideo = (file) => {
    return (file?.type.split("/").includes("video") && (file?.name.endsWith(".mp4") || file?.name.endsWith(".avi") || file?.name.endsWith(".wmv") || file?.name.endsWith(".flv") || file?.name.endsWith(".mov")))
}


exports.getMongoDateDay = (date) => {
    const dateObj = new Date(date)
    return dateObj.getDate()
}

exports.convertDateToMillis = (date) => {
    return new Date(date).getTime()
}

exports.dateExpirated = (date) => {
    const isExpired = new Date(date).getTime() - new Date().getTime()
    return isExpired > 0 ? false : true
}

exports.areIn = (arr1, arr2) => {
    return arr1?.some((arr) => arr2?.includes(arr))
}

exports.isIn = (element, arr) => {
    return arr.includes(element);
};

exports.sum = (arr) => {
    return arr.reduce((a, b) => a + b, 0);
};

exports.displayMilleSeparatorLabel = (data) => data?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

exports.displayMilleSeparatorInput = (input, fieldName, setInputs, separator) => {
    const inputValue = input.replace(/[^0-9]/g, separator || '') // supprimer tous les caractères qui ne sont pas des chiffres
    const formattedValue = Number(inputValue).toLocaleString() // ajouter un séparateur de milliers
    setInputs(prevState => ({ ...prevState, [fieldName]: formattedValue }))
}

exports.deleteSeparator = (input, separator) => { return input.replace(/\D/g, separator || '') }

// SUPPRIMER TOUTES LES OCCURENCES D'UN ELEMENT DANS UN TABLEAU
exports.removeItemAll = (arr, value) => {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
};

// SUPPRIMER LA PREMIERE OCCURENCE D'UN ELEMENT DANS UN TABLEAU
exports.removeItemOnce = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};