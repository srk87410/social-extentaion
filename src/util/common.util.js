import moment from "moment";

export function formatDate(date, format = "DD MMM YYYY, h:mm A") {
    if (!date || moment(date).isValid() === false) {
      return "-";
    }
    return moment(date).format(format);
  }

  export const getThemeConfiguration = (darkMode) => {

    return {
      token: {
        colorPrimary: darkMode ? "#1890FF" : "#1890FF",
        colorBgBase: darkMode ? "#333" : "#FFFFFF",
        colorTextBase: darkMode ? "#FFFFFF" : "#000000",
        colorWarningBg: darkMode ? "" : "#FFFBE6",
      },
      components: {
        Table: {
          rowHoverBg: darkMode ? "#292929" : "#F2F2F2",
          rowSelectedBg: darkMode ? "#292929" : "#F2F2F2",
          rowSelectedHoverBg: darkMode ? "#292929" : "#F2F2F2",
          colorText: darkMode ? "#fff" : "#000",
        },
        Switch: {
          colorPrimary: darkMode ? "#126BE7" : "#1890FF",
        },
        Alert: {
          colorWarningBg: darkMode ? "#FFE58F" : "#FFFBE6",
          colorTextHeading: darkMode ? "#000000" : "#000000",
        },
        Select: {
          optionActiveBg: darkMode ? "#666666" : "#D9D9D9",
          optionSelectedBg: darkMode ? "#292929" : "#E6F4FF",
          colorText: darkMode ? "#fff" : "#000000",
        },
        Tooltip: {
          colorBgSpotlight: darkMode ? "#333333" : "#FFFFFF",
          colorTextLightSolid: darkMode ? "#FFFFFF" : "#000000",
        },
      },
    };
  }