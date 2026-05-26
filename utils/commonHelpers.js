// Capitalizing strings

const formatName = (unformattedName)=>{

    if (!unformattedName) return "";

    let formattedName = unformattedName.trim();

    return formattedName[0].toUpperCase() +
     formattedName.slice(1).toLowerCase();
}

module.exports = {
    formatName
};