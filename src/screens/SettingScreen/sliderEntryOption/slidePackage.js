import { StyleSheet, Dimensions, Platform } from 'react-native';
import { color } from '~/config'
export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD',
    inActiveColor: '#DDDDDF',
    activeColor: color.primary
}

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    paginationContainer: {
        paddingVertical: 15,
    },
    paginationDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 2,
        borderColor: 'transparent',
        borderWidth: 1,
        borderStyle: "solid",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    paginationDotActive: {
        borderColor: colors.activeColor,     
    },
    paginationDotInner: {
        backgroundColor: colors.inActiveColor,
        width: 8,
        height: 8,
        borderRadius: 4,
        position: "absolute",
        left: 3,
        top: 3
    },
    paginationDotInnerActive: {
        backgroundColor: colors.activeColor
    }
});