export default class Utils {

    getDaysInMonth(month, year) {
            var date = new Date(Date.UTC(year, month, 1));
            var days = [];
            while (date.getMonth() === month) {
                var d = new Date(date);
                days.push(d.getDate() + '/' + d.getMonth());
                date.setDate(date.getDate() + 1);
            }
            return days;
    }

    //Get all element Siblings
    getSiblings = element => {
        let siblings = [];
        let sibling = element.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== element) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling;
        }
        return siblings;
    }

    getNumberDays = (start, end) => {
        let diffTime = (new Date(end)) - (new Date(start));
        return diffTime / (60 * 60 * 1000 * 24);
    }
  
}

export function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export const convertNumberToText = number => {
    let textNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    let chuoi, hauto, ty, trieu, nghin, tram, chuc, donvi;

    function dochangchuc(so, daydu) {
        let chuoi = "";
        chuc = Math.floor(so / 10);
        donvi = so % 10;
        if (chuc > 1) {
            chuoi = " " + textNumbers[chuc] + " mươi";
            if (donvi == 1) {
                chuoi += " mốt";
            }
        } else if (chuc == 1) {
            chuoi = " mười";
            if (donvi == 1) {
                chuoi += " một";
            }
        } else if (daydu && donvi > 0) {
            chuoi = " lẻ";
        }
        if (donvi == 5 && chuc > 1) {
            chuoi += " lăm";
        } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
            chuoi += " " + textNumbers[donvi];
        }
        return chuoi;
    }

    function docblock(so, daydu) {
        let chuoi = "";
        tram = Math.floor(so / 100);
        so = so % 100;
        if (daydu || tram > 0) {
            chuoi = " " + textNumbers[tram] + " trăm";
            chuoi += dochangchuc(so, true);
        } else {
            chuoi = dochangchuc(so, false);
        }
        return chuoi;
    }

    function dochangtrieu(so, daydu) {
        let chuoi = "";
        trieu = Math.floor(so / 1000000);
        so = so % 1000000;
        if (trieu > 0) {
            chuoi = docblock(trieu, daydu) + " triệu";
            daydu = true;
        }
        nghin = Math.floor(so / 1000);
        so = so % 1000;
        if (nghin > 0) {
            chuoi += docblock(nghin, daydu) + " nghìn";
            daydu = true;
        }
        if (so > 0) {
            chuoi += docblock(so, daydu);
        }
        return chuoi;
    }

    if (number == 0) return textNumbers[0];
    chuoi = "",
        hauto = "";
    do {
        ty = number % 1000000000;
        number = Math.floor(number / 1000000000);
        if (number > 0) {
            chuoi = dochangtrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty, false) + hauto + chuoi;
        }
        hauto = " tỷ";
    } while (number > 0);
    let result = chuoi.trim()[0].toUpperCase() + chuoi.trim().slice(1) + (' đồng chẵn');
    return result;
}

export const currencyFormat = value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")


export const randomDataChart = (length, min, max, currency) => {
    const arr = [];
    for (let i = 0; i <= length; i++) {
        if (currency == true) {
            arr[i] = Math.floor(Math.random() * (max - min) + min) * 1000;
        } else {
            arr[i] = Math.floor(Math.random() * (max - min) + min);
        }
    }
    return arr;
}