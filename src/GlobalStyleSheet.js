const customStyle = {

}

const spaceUlities = (prefixArr) => {
    let ulities = {};
    const maxValue = 30;
    prefixArr.map(prefix => {
        for (let i = 0; i <= maxValue; i += 5) {
            ulities[`p${prefix}${i}`] = {
                [`padding${prefix}`]: i
            }
            ulities[`m${prefix}${i}`] = {
                [`margin${prefix}`]: i
            }
            ulities[`mx${i}`] = {
                [`marginLeft`]: i,
                [`marginRight`]: i
            }
            ulities[`my${i}`] = {
                [`marginTop`]: i,
                [`marginBottom`]: i
            }
            ulities[`px${i}`] = {
                [`paddingLeft`]: i,
                [`paddingRight`]: i
            }
            ulities[`py${i}`] = {
                [`paddingTop`]: i,
                [`paddingBottom`]: i
            }
        }
    });
    return ulities;
}

const createGlobalStyle = () => {
    const ulities = spaceUlities(['Left','Top','Right','Bottom']);

    return {
        ...ulities,
        ...customStyle
    };
}

const gbStyle = createGlobalStyle();

export default gbStyle;

