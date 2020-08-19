import moment from "moment";
import "moment/min/locales";
moment.locale("vi");

export default class Utils {
  getDaysInMonth(month, year) {
    const date = new Date(Date.UTC(year, month, 1));
    const days = [];
    while (date.getMonth() === month) {
      const d = new Date(date);
      days.push(`${d.getDate()}/${d.getMonth()}`);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  // Get all element Siblings
  getSiblings = (element) => {
    const siblings = [];
    let sibling = element.parentNode.firstChild;
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== element) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  };

  getNumberDays = (start, end) => {
    const diffTime = new Date(end) - new Date(start);
    return diffTime / (60 * 60 * 1000 * 24);
  };
}

export function create_UUID() {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export const convertNumberToText = (number) => {
  const textNumbers = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  let chuoi;
  let hauto;
  let ty;
  let trieu;
  let nghin;
  let tram;
  let chuc;
  let donvi;

  function dochangchuc(so, daydu) {
    let chuoi = "";
    chuc = Math.floor(so / 10);
    donvi = so % 10;
    if (chuc > 1) {
      chuoi = ` ${textNumbers[chuc]} mươi`;
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
      chuoi += ` ${textNumbers[donvi]}`;
    }
    return chuoi;
  }

  function docblock(so, daydu) {
    let chuoi = "";
    tram = Math.floor(so / 100);
    so %= 100;
    if (daydu || tram > 0) {
      chuoi = ` ${textNumbers[tram]} trăm`;
      chuoi += dochangchuc(so, true);
    } else {
      chuoi = dochangchuc(so, false);
    }
    return chuoi;
  }

  function dochangtrieu(so, daydu) {
    let chuoi = "";
    trieu = Math.floor(so / 1000000);
    so %= 1000000;
    if (trieu > 0) {
      chuoi = `${docblock(trieu, daydu)} triệu`;
      daydu = true;
    }
    nghin = Math.floor(so / 1000);
    so %= 1000;
    if (nghin > 0) {
      chuoi += `${docblock(nghin, daydu)} nghìn`;
      daydu = true;
    }
    if (so > 0) {
      chuoi += docblock(so, daydu);
    }
    return chuoi;
  }

  if (number == 0) return textNumbers[0];
  (chuoi = ""), (hauto = "");
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
  const result = `${
    chuoi.trim()[0].toUpperCase() + chuoi.trim().slice(1)
  } đồng chẵn`;
  return result;
};

export const currencyFormat = (value, seperator = ".") => {
  value += "";
  let x = value.split(",");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + seperator + "$2");
  }
  return x1 + x2;
};

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
};

export const pad = (n) => (n >= 10 ? n : `0${n}`);

export const filterDuplicateArr = (arr, key) => {
  const filteredArr = arr.reduce((acc, current) => {
    const x = acc.find((item) => item[key] === current[key]);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
};

export const formatDate = () => {
  function formatDateToString(date) {
    return moment(date).format("DD-MM-YYYY");
  }
  function formatStringToDate(strDate) {
    return moment(strDate, "DD-MM-YYYY");
  }
  return { formatDateToString, formatStringToDate };
};

export const nonAccentVietnamese = (str) => {
  str = str.toLowerCase();
  str = str.replace(
    /\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g,
    "a"
  );
  str = str.replace(
    /\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g,
    "e"
  );
  str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  str = str.replace(
    /\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g,
    "o"
  );
  str = str.replace(
    /\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g,
    "u"
  );
  str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  str = str.replace(/\u0111/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};
