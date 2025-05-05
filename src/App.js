
import { ConfigProvider } from "antd";
import './App.css';
import { useThemeContext } from "./ThemeContext";
import FormComponent from './Component/Form';
import { useMemo } from "react";
import { getThemeConfiguration } from "./util/common.util";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

function App() {
  const { theme } = useThemeContext();
  const themeConfig = useMemo(() => getThemeConfiguration(theme), [theme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="App">
        <FormComponent />
      </div>
    </ConfigProvider>
  );
}

export default App;
