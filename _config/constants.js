exports.regex = {
    phone: /(^(\+223|00223)?[5-9]{1}[0-9]{7}$)/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}

exports.upload_files_constants = {
    MAX_FILES_TO_UPLOAD: 4,
    FILES_ALLOW_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/avi'],//to be extend later
    MAX_SIZE: 10 * 1024 * 1024, //10 MO
}