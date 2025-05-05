/* eslint-disable */
import { useEffect, useState,useContext } from "react";
import "./Form.css";
import {
  Space,
  Typography,
  Input,
  Form,
  Checkbox,
  Select,
  Alert,
  Divider,
  Modal,
  Button,
  Row,
  Image,
  Col,
  Flex,
  Spin,
  notification,
  ConfigProvider,
  Card,
  Tooltip,
  Avatar,
  Segmented,
  Carousel,
  Popover,
} from "antd";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "../countryList.json";
import logo from "../images/logo.png";
import icon from "../images/Info.svg";
import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  KeyOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  ShopOutlined,
  StarOutlined,
  UserOutlined,
  ShoppingOutlined,
  MoonOutlined,
  SunOutlined
} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import langList from "../lang.json"
import { useThemeContext } from "../ThemeContext";
const { Text, Title } = Typography;

const TAB_ITEMS = ["home", "data", "help"];
// import lang from "../util/lang/lang.json";
const FormComponent = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [rData, setRData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [setting, setSetting] = useState(null);
  const [licenseDetails, setLicenseDetails] = useState(null);

  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [scrapData, setScrapData] = useState({});
  const { t, i18n } = useTranslation();
  const getScrapeData = () => {
    sendChromeMessage({ type: "get_scrap" }, (response) => {
      if (response.status == true) {
        const data = response.data;
        setScrapData(data);
      } else {
        setScrapData({});
      }
    });
  };

  const [selectedKeywordId, setSelectedKeywordId] = useState("select");
  const [activeStep, setActiveStep] = useState(0);
  //activation form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [key, setKey] = useState("");
  const [keyIsValid, setKeyIsValid] = useState(false);

  const [selectedTabId, setSelectedTabId] = useState(0);
  const [network, setNetwork] = useState('facebook');
  const [countryCode, setCountryCode] = useState('India');
  const [delay, setDelay] = useState(1);
  const [selectLang, setSelectLang] = useState('en')
  const [dataFormate, setDataFormate] = useState("csv");
  const [removeDuplicate, setRemoveDuplicate] = useState("only_phone");
  const [renewKey, setRenewKey] = useState("");
  const { theme, toggleTheme } = useThemeContext(null);
  const columns = [
    {
      value: "title",
      label: "Title",
    },
    {
      value: "phone",
      label: "Phone Number",
    },
    {
      value: "email",
      label: "Email",
    },
    {
      value: "url",
      label: "Website Url",
    },
  ];

  //var dummy={};

  const [extractCol, setExtractCol] = useState({});

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState('')
  const [showValidation, setShowValidation] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);

  const renewOpenForm = () => {
    setRenewKey("");
    setRenewOpen(true);
  };
  const renewCloseForm = () => {
    setRenewOpen(false);
  };

  // const [theme, setTheme] = useState({
  //   token: {
  //     colorPrimary: "#0855a4",
  //   },
  // });

  useEffect(() => {
    let color = "#0855a4";

    if (product?.color) {
      color = product.color;
    }

    if (rData?.themeSetting?.primaryColor) {
      color = rData.themeSetting.primaryColor;
    }

    // setTheme({
    //   token: {
    //     colorPrimary: color,
    //   },
    // });
  }, [product, rData]);

  //check email regex

  const isEmailIsValid = (email) => {
    const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexPattern.test(email);
  };

  const sendChromeMessage = (data, callback) => {
    try {
      chrome.runtime.sendMessage(data, (response) => {
        callback(response);
      });
    } catch (e) {
      console.log("sendMessage Error:", e);
      callback({
        status: false,
        message: "Something is wrong",
      });
    }
  };

  const getProductData = () => {
    sendChromeMessage({ type: "get_product" }, (response) => {
      console.log("product:", response);
      if (response.status) {
        //setIsLoading(false);
        setProduct(response.product);
      }
    });
  };

  const getResellerData = () => {
    sendChromeMessage({ type: "get_data" }, (response) => {
      console.log("rData:", JSON.stringify(response));
      if (response.status == true) {
        setRData(response.data);
        setPhone("+" + response.data.country_code);

        const c = countryList.find(
          (c) => c.countryCode == (response.data.country ?? "IN")
        );
        if (c) {
          setCountry(c.countryNameEn);
        } else {
          console.log("Country name not found");
        }
      }
    });
  };

  const getSetting = () => {
    sendChromeMessage({ type: "get_setting" }, (response) => {
      console.log("setting:", JSON.stringify(response));

      if (response.status == true) {
        const data = response.setting;
        setSetting(data);
        setDataFormate(data.exportForm);
        setRemoveDuplicate(data.removeDuplicate);
        setDelay(data.delay);
        setExtractCol(data.extractCol);
        setSelectLang(data.lang ?? "en");
        i18next.changeLanguage(data.lang ?? "en");
        // i18next.changeLanguage(e ?? "en");
      } else {
        api.error({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      }
    });
  };

  const expireDate = () => {
    if (licenseDetails) {
      let expDate = new Date(licenseDetails?.expireAt);
      const year = expDate.getUTCFullYear();
      const month = expDate.getUTCMonth() + 1;
      const day = expDate.getUTCDate();
      return `${day}-${month}-${year}`;
    } else {
      return "";
    }
  };

  const renewLicenseKey = () => {
    sendChromeMessage({ key: licenseDetails.key, renew_key: renewKey, type: "renew" }, (response) => {
      if (response.status == true) {
        api.success({
          key: "success",
          message: response.message,
          duration: 2,
          placement: "bottomLeft",
        });
        setTimeout(() => renewCloseForm(), 500);
      } else {
        api.error({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        })
      }
    });
  };


  const getLicenseDetails = () => {
    sendChromeMessage({ type: "get_details" }, (response) => {
      console.log("License Details:", response);

      if (response.status == true) {
        setLicenseDetails(response.detail);
        setIsLicenseValid(true);
        setLicenseMessage("");
      } else {
        setIsLicenseValid(true);
        setLicenseDetails(null);
        setLicenseMessage(response.message);
      }
      setIsLoading(false);
    });
  };
  const get_youtube_thumbnail = (url, quality) => {
    if (url) {
      var video_id, thumbnail, result;
      if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
        video_id = result.pop();
      } else if ((result = url.match(/youtu.be\/(.{11})/))) {
        video_id = result.pop();
      }

      if (video_id) {
        if (typeof quality == "undefined") {
          quality = "high";
        }

        var quality_key = "maxresdefault"; // Max quality
        if (quality == "low") {
          quality_key = "sddefault";
        } else if (quality == "medium") {
          quality_key = "mqdefault";
        } else if (quality == "high") {
          quality_key = "hqdefault";
        }

        var thumbnail =
          "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
        return thumbnail;
      }
    }
    return false;
  };

  useEffect(() => {
    columns.forEach((x) => {
      setExtractCol((col) => {
        return { ...col, [x.value]: true };
      });
    });
    getResellerData();
    getSetting();
    getProductData();
    getLicenseDetails();
  }, []);

  useEffect(() => {
    checkLicense(key);
  }, [key]);

  function checkLicense(key) {
    if (key.length == 19) {
      sendChromeMessage(
        { license_key: key, type: "license_verify" },
        (response) => {
          console.log("checkLicenseKey:", JSON.stringify(response));
          setKeyIsValid(response.status);
        }
      );
    } else {
      setKeyIsValid(false);
    }
  }

  const [errors, setErrors] = useState({});

  const onActivateSubmit = async () => {
    console.log("button submit", { name });

    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phone) newErrors.phone = "Phone is required";
    if (!city) newErrors.city = "City is required";
    if (!country) newErrors.country = "Country is required";
    if (!key) newErrors.key = "License Key is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const msg = {
      name: name,
      email: email,
      phone: `+${phone}`,
      city: city,
      country: country,
      key: key,
    };

    sendChromeMessage({ data: msg, type: "license_active" }, (response) => {
      console.log("activate:", JSON.stringify(response));

      if (response.status == true) {
        setIsLicenseValid(true);
        getLicenseDetails();
        api.success({
          key: "success",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      } else {
        setIsLicenseValid(false);
        api.error({
          key: "success",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      }
    });
  };

  const onSaveSetting = (values) => {
    const data = {
      exportForm: dataFormate,
      removeDuplicate: values.removeDuplicate,
      delay: values.delay,
      extractCol: extractCol,
      lang: selectLang,
    };
    setShowValidation(true);

    sendChromeMessage({ setting: data, type: "save_setting" }, (response) => {
      if (response.status) {
        i18next.changeLanguage(selectLang)
        api.success({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      } else {
        api.error({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      }
    });
  };
  const onScrape = (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (keyword == "") {
      return enqueueSnackbar(t("keywordIsRequired"));
    }


    console.log("countryCode:", countryCode);

    const countryDialCode = "+" + countryList.find(
      (c) => c.countryNameEn == countryCode
    ).countryCallingCode;

    sendChromeMessage({
      keyword: keyword,
      location: location,
      network: network,
      country: countryDialCode,
      type: "scrap"
    }, (response) => {
      if (response.status == true) {
        api.success({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      } else {
        api.error({
          key: "error",
          message: t(response.message),
          duration: 2,
          placement: "bottomLeft",
        });
      }
    });
  };
  // const onScrape = (e) => {
  //   e.preventDefault();
  //   setShowValidation(true);
  //   if (keyword == "") {
  //     return api.error({
  //       key: "error",
  //       message: "keyword is required",
  //       duration: 2,
  //       placement: "bottomLeft",
  //     });
  //   }

  // sendChromeMessage({ keyword: keyword, type: "scrap" }, (response) => {
  //   console.log("scrap:", JSON.stringify(response));
  //   if (response.status == true) {
  //     api.success({
  //       key: "error",
  //       message: response.message,
  //       duration: 2,
  //       placement: "bottomLeft",
  //     });
  //   } else {
  //     api.error({
  //       key: "error",
  //       message: response.message,
  //       duration: 2,
  //       placement: "bottomLeft",
  //     });
  //   }

  getScrapeData();
  const onDownloadScrapData = () => {
    sendChromeMessage(
      { type: "download", keyword: selectedKeywordId },
      (response) => {
        console.log("download: ", response);
      }
    );
  };

  const onDeleteScrapData = () => {
    sendChromeMessage(
      { type: "delete_scrap", keyword: selectedKeywordId },
      (response) => {
        if (response.status == true) {
          api.success({
            key: "success",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          });
          setSelectedKeywordId("select");
          getScrapeData();
        } else {
          api.error({
            key: "error",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          });
        }
      }
    );
  };

  const onClearScrapData = () => {
    sendChromeMessage(
      { type: "clear_scrap", keyword: selectedKeywordId },
      (response) => {
        if (response.status == true) {
          api.success({
            key: "success",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          });
          setScrapData({});
        } else {
          api.error({
            key: "error",
            message: t(response.message),
            duration: 2,
            placement: "bottomLeft",
          });
        }
      }
    );
  };

  const dateFormat = (dateString, showTime) => {
    let expDate = new Date(dateString);
    let optionsDate = { year: "numeric", month: "long", day: "numeric" };
    //return expDate.toLocaleDateString("en-in", optionsDate)+(showTime? " "+expDate.toLocaleTimeString("en-in"):"");
    const year = expDate.getUTCFullYear();
    const month = expDate.getUTCMonth() + 1; // Months are zero-indexed, so we add 1
    const day = expDate.getUTCDate();
    return `${day}-${month}-${year}`;
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Space style={{ padding: "24px" }}>
            <Typography.Text>{children}</Typography.Text>
          </Space>
        )}
      </Typography>
    );
  }

  const totalSlider = () => {
    var count = 0;
    if (product != null) {
      if (product.showAd) {
        count++;
      }

      if (
        product.demoVideoUrl != "" &&
        (product.demoVideoUrl ?? "").includes("youtube.com")
      ) {
        count++;
      }
    }

    return count;
  };

  const getBannerUrl = (url) => {
    return url && url.trim() !== ""
      ? url
      : "https://picsum.photos/id/237/200/300";
  };

  const cardHeadStyle = {
    padding: "8px",
  };

  const ContactCard = (
    <Card
      size="small"
      style={{
        width: 300,
      }}
      bodyStyle={{
        padding: 10,
      }}
    >
     <Flex align="center" style={{ marginBottom: 8 }}>
        <PhoneOutlined style={{ fontSize: "14px", marginRight: 18 }} />
        <div>
          <Text type="secondary">Phone</Text>
          <br />
          <Text>{licenseDetails?.phone || "-"}</Text>
        </div>
      </Flex>
      <Divider style={{ margin: "6px 0" }} />
      <Flex align="center" style={{ marginBottom: 8 }}>
        <MailOutlined style={{ marginRight: 12, fontSize: 18 }} />
        <div>
          <Text type="secondary">Email</Text>
          <br />
          <Text>{licenseDetails?.email || "-"}</Text>
        </div>
      </Flex>
      <Divider style={{ margin: "6px 0" }} />
      <Flex align="center">
        <GlobalOutlined style={{ marginRight: 12, fontSize: 18 }} />
        <div>
          <Text type="secondary">Website</Text>
          <br />
          {/* <Link
            href="https://www.instagram.com/_moonlight._.studio_/"
            target="_blank"
          > */}
          {licenseDetails?.website || "-"}
          {/* </Link> */}
        </div>
      </Flex>
    </Card>
  );

  return (
    <>
      {contextHolder}
      {/* <ConfigProvider theme={theme}> */}
        <Modal
          title={t("renewLicense")}
          open={renewOpen}
          onCancel={() => setRenewOpen(false)}
          footer={[
            <Row gutter={[16, 16]}>
              <Col span={12}>
              <Button
              style={{ color: "#fff", backgroundColor: "#2d49d8" }}
              key="renew" type="primary" onClick={renewLicenseKey}>
                {t("renew")}
              </Button>
              </Col>

              <Col span={12}>
                {product && rData?.active_shop && (
                  <Button key="buy" block>
                    <a
                      href={product?.siteUrl || rData?.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShopOutlined /> {t("buyNow")}
                    </a>
                  </Button>
                )}
              </Col>
            </Row>,
          ]}
        >
          <Input
            value={renewKey}
            onChange={(e) => setRenewKey(e.target.value)}
            placeholder={t("enterLicenseKey")}
            prefix={<KeyOutlined />}
          />
          <Paragraph>{t("renewDBMbeforeExpire")}</Paragraph>
          <Paragraph>{t("subscription1Y")}</Paragraph>
          <Paragraph>{t("subscription3M")}</Paragraph>
          <Paragraph>{t("subscription1M")}</Paragraph>
        </Modal>

        <>
          {!showSecond && (
            <>
              <Card
                size="small"
                title={
                  <Flex justify="space-between" align="baseline">
                    <Flex flexDirection="column" align="baseline">
                      <Image
                        src={logo}
                        alt={product?.name ?? ""}
                        height={40}
                        width={40}
                        preview={false}
                      />
                      <Typography.Paragraph
                        style={{
                          color: "#000",
                          fontSize: "16px",
                          margin: "0",
                        }}
                      >
                        DBM Social Extractor
                      </Typography.Paragraph>
                    </Flex>
                    <Flex flexDirection="column" align="self-end">
                    {theme ? (
                      <SunOutlined
                        key="SunOutlined"
                        onClick={toggleTheme}
                        style={{ marginRight: 10, fontSize: "18px" }}
                      />
                    ) : (
                      <MoonOutlined
                        key="MoonOutlined"
                        onClick={toggleTheme}
                        style={{ marginRight: 10, fontSize: "18px" }}
                      />
                    )}
                    <Popover placement="left" title={ContactCard} arrow={false}>
                      <Image
                        src={icon}
                        alt="Info"
                        height={20}
                        width={20}
                        preview={false}
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      />
                    </Popover>
                  </Flex>
                    {/* <Tooltip
                      placement="rightTop"
                      title={ContactCard}
                      color="white"
                      overlayInnerStyle={{
                        padding: 0,
                        width: "100%",
                      }}
                      overlayStyle={{
                        width: "100%",
                        whiteSpace: "normal",
                        zIndex: 9999,
                      }}
                    >
                      <Image
                        src={icon}
                        alt="Info"
                        height={20}
                        width={20}
                        preview={false}
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      />
                    </Tooltip> */}
                  </Flex>
                }
                bodyStyle={{
                  padding: 0,
                }}
                headStyle={cardHeadStyle}
              ></Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  backgroundColor: "#ffffff",
                }}
              >
                <Image
                  src={logo}
                  alt="Google Logo"
                  preview={false}
                  loading="lazy"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                    marginBottom: "24px",
                  }}
                />

                <Space
                  direction="vertical"
                  align="center"
                  style={{ width: "100%" }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    Welcome to DBM Social Extractor
                  </Title>

                  <Paragraph style={{ textAlign: "center", maxWidth: "300px" }}>
                    This Chrome extension is not endorsed or certified by Social extension ™. This is an unofficial enhancement for Social extension™.
                  </Paragraph>

                  <Button
                    style={{ color: "#fff", backgroundColor: "#2d49d8" }}
                    type="primary"
                    block
                    onClick={() => setShowSecond((prev) => !prev)}
                  >
                    <SendOutlined /> Get Started
                  </Button>
                </Space>
              </div>
              <Card
                bordered
                style={{
                  width: "100%",
                  textAlign: "center",
                  position: "absolute",
                  bottom: 0,
                }}
                bodyStyle={{ padding: "12px" }}
              >
                <Text>V1.1 | DBM Social Extractor</Text>
              </Card>
            </>
          )}
        </>

        {showSecond && (
          <Typography
            style={{
              width: "100%",
              height: 50,
              // backgroundColor: theme.token.colorPrimary,
            }}
          >
            <Card
              size="small"
              title={
                <Flex justify="space-between" align="baseline">
                  <Flex flexDirection="column" align="baseline">
                    <Image
                      src={logo}
                      alt={product?.name ?? ""}
                      height={40}
                      width={40}
                      preview={false}
                    />
                    <Typography.Paragraph
                      style={{ color: "#000", fontSize: "16px", margin: "0" }}
                    >
                      {rData?.name ?? "DBM Social Extractor"}
                    </Typography.Paragraph>
                  </Flex>
                  {!isLicenseValid ? (
                    <Tooltip
                      placement="rightTop"
                      title={ContactCard}
                      color="white"
                      overlayInnerStyle={{
                        padding: 0,
                        width: "100%",
                      }}
                      overlayStyle={{
                        width: "100%",
                        whiteSpace: "normal",
                        zIndex: 9999,
                      }}
                    >
                      <Image
                        src={icon}
                        alt="Info"
                        height={20}
                        width={20}
                        preview={false}
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <>
                    {theme ? (
                      <SunOutlined
                        key="SunOutlined"
                        onClick={toggleTheme}
                        style={{ marginLeft: 90, fontSize: "18px" }}
                      />
                    ) : (
                      <MoonOutlined
                        key="MoonOutlined"
                        onClick={toggleTheme}
                        style={{ marginLeft: 90, fontSize: "18px" }}
                      />
                    )}
                    <span
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "20px",
                      }}
                      onClick={() => setShowSettings((prev) => !prev)}
                    >
                      {showSettings ? <CloseOutlined /> : <SettingOutlined />}
                    </span>
                    </>
                  )}
                </Flex>
              }
              bodyStyle={{
                padding: 0,
              }}
              headStyle={cardHeadStyle}
            ></Card>
            {showSettings && (
              <Row
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <Row justify="center">
                  <Col style={{ marginTop: 7, padding: "8px 16px" }}>
                    <Card size="small">
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={onSaveSetting}
                        initialValues={{
                          removeDuplicate: removeDuplicate,
                          delay: delay,
                          language: "en",
                        }}
                      >
                        <Row
                          style={{ display: "flex", flexDirection: "column", padding: "10px" }}
                        >

                          <Row style={{ marginTop: "-20px" }} gutter={[16, 16]}>
                            <Col span={12}>
                              <Form.Item label={t("delay")} name="delay">
                                <Input
                                  type="number"
                                  placeholder="Enter delay in seconds"
                                  min={1}
                                  autoComplete="off"
                                  onChange={(e) => setDelay(e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label={t("language")}
                                name="language"
                              >
                                <Select
                                  value={selectLang}
                                  onChange={setSelectLang}
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                  }
                                  style={{ width: "100%" }}
                                  placeholder={t("selectLanguage")}
                                >
                                  {langList.map((x) => (
                                    <Select.Option key={x.key} value={x.key}>
                                      {x.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                          </Row>
                        </Row>

                        <Typography.Text strong>
                        {t("extractingCol")}
                        </Typography.Text>

                        <Row>
                          {columns.map((col) => (
                            <Col span={12} key={col.value}>
                              <Checkbox
                                checked={extractCol[col.value]}
                                style={{ marginTop: "12px" }}
                                onChange={(e) =>
                                  setExtractCol((ec) => ({
                                    ...ec,
                                    [col.value]: e.target.checked,
                                  }))
                                }
                              >
                                {col.label}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>

                        <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                          <Col span={24}>
                            <Button
                              style={{ color: "#fff", backgroundColor: "#2d49d8" }}
                              type="primary" htmlType="submit" block>
                              <SaveOutlined /> {t("save")}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </Row>
            )}
          </Typography>
        )}
        <br />
        {showSecond && (
          <>
            {!showSettings && (
              <>
                {isLoading ? (
                  <Typography
                    className="mainBox"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Spin tip="Loading... please wait" />
                  </Typography>
                ) : (
                  <Typography>
                    {isLicenseValid ? (
                      <Typography style={{ padding: "8px 16px" }}>
                        <Card
                          size="small"
                          bodyStyle={{
                            padding: 3,
                            width: "100%",
                          }}
                        >
                          <Flex justify="space-between" align="center">
                            <Flex justify="flex-start" align="center">
                              <Popover
                                title={
                                  <Text copyable>
                                    {licenseDetails?.key ?? ""}
                                  </Text>
                                }
                              >
                                <Avatar
                                  src=""
                                  size={30}
                                  icon={<UserOutlined />}
                                />
                              </Popover>
                              <Typography style={{ marginLeft: 7 }}>
                                <Text strong style={{ fontSize: 14 }}>
                                  {licenseDetails?.name ?? ""}
                                </Text>
                                <br />
                                <Flex justify="space-between" align="center">
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                   {t("expireDate")}{" "}
                                    <Text
                                      strong
                                      style={{ color: "black", fontSize: 11 }}
                                    >
                                      {expireDate()}
                                    </Text>
                                  </Text>
                                </Flex>
                              </Typography>
                            </Flex>

                            <Flex align="center">
                              <Button
                                type="primary"
                                size="small"
                                onClick={renewOpenForm}
                                style={{
                                  padding: "0px 10px",
                                  color: "#fff", backgroundColor: "#2d49d8"
                                }}
                              >
                                <Space size={4} style={{ width: "100%" }}>
                                  <span
                                    style={{
                                      height: 5,
                                      width: 5,
                                    backgroundColor: "#fff",
                                      borderRadius: "50%",
                                      display: "inline-block",
                                      marginBottom: 4,
                                     
                                    }}
                                  />
                                 {t("renew")}
                                </Space>
                              </Button>
                            </Flex>
                          </Flex>
                        </Card>
                        <Typography
                          style={{
                            // background: theme.token.colorPrimary,
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                        >
                          <Card
                            size="small"
                            bodyStyle={{
                              padding: 4,
                            }}
                          >
                            <Row
                              gutter={[16, 16]}
                              align="middle"
                              justify="center"
                            >
                              <Col span={24}>
                                <Segmented
                                  options={[
                                    {
                                      value:"home",
                                      label:t("home")
                                    },
                                    {
                                      value:"data",
                                      label:t("data")
                                    },
                                    {
                                      value:"help",
                                      label:t("help")
                                    }
                                  ]}
                                  value={TAB_ITEMS[selectedTabId]}
                                  onChange={(value) => {
                                    const index = TAB_ITEMS.indexOf(value);
                                    setSelectedTabId(index);
                                  }}
                                  block
                                  style={{
                                    width: "100%",
                                    backgroundColor: "#f0f0f0",
                                    borderRadius: 8,
                                    padding: 4,
                                  }}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </Typography>
                        <Typography className="mainBox">
                          {selectedTabId == 0 ? (
                            <>
                              <Row
                                gutter={[0, 0]}
                                align="middle"
                                justify="center"
                                style={{ flexDirection: "column" }}
                              >
                                <Card
                                  style={{ width: 320, borderRadius: 10 }}
                                  bodyStyle={{
                                    padding: "6px 7px",
                                  }}
                                >
                                  <Form layout="vertical">
                                    {/* First Row */}
                                    <Row gutter={[16, 16]}>
                                      <Col span={12}>
                                        <Form.Item
                                          name="keyword"
                                          label={t("keyword")}
                                          validateStatus={keyword === "" && showValidation ? "error" : ""}
                                          help={keyword === "" && showValidation ? t("keywordIsRequired") : ""}
                                        >
                                          <Input
                                            placeholder={t("keyword")}
                                            prefix={<LinkOutlined />}
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col span={12}>
                                        <Form.Item
                                          name="location"
                                          label={t("location")}
                                          validateStatus={location === "" && showValidation ? "error" : ""}
                                          help={location === "" && showValidation ? t("locationReq") : ""}
                                        >
                                          <Input
                                            placeholder={t("enterLocation")}
                                            prefix={<LinkOutlined />}
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </Row>

                                    {/* Second Row */}
                                    <Row gutter={[16, 16]}>
                                      <Col span={12}>
                                        <Form.Item name="network" label={t("network")}>
                                          <Select
                                            defaultValue={'facebook'}
                                            value={network}
                                            onChange={(value) => setNetwork(value)}
                                            placeholder={t("network")}
                                          >
                                            <Option value="facebook">{t("facebook")}</Option>
                                            <Option value="twitter">{t("twitter")}</Option>
                                            <Option value="linkedin">{t("linkedin")}</Option>
                                            <Option value="instagram">{t("instagram")}</Option>
                                          </Select>
                                        </Form.Item>
                                      </Col>

                                      <Col span={12}>
                                        <Form.Item name="country" label={t("selectCountry")}>
                                          <Select
                                            defaultValue={'India'}
                                            value={countryCode}
                                            onChange={(value) => setCountryCode(value)}
                                            placeholder={t("selectCountry")}
                                          >
                                            {countryList.map((x) => (
                                              <Option key={x.countryCode} value={x.countryNameEn}>
                                                {x.countryNameEn}
                                              </Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                    </Row>

                                    {/* Button */}
                                    <Button
                                      onClick={onScrape}
                                      type="primary"
                                      htmlType="submit"
                                      block
                                      style={{ marginBottom: 10, color: "#fff", backgroundColor: "#2d49d8" }}
                                    >
                                      <StarOutlined /> {t("start")}
                                    </Button>
                                  </Form>
                                </Card>

                                <Row item xs={12}>
                                  <Space
                                    style={{
                                      marginTop: "10px",
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    {product != null &&
                                      rData?.show_ads == true ? (
                                      <div style={{ marginTop: 20 }}>
                                        <Carousel
                                          autoplay
                                          beforeChange={(from, to) =>
                                            setActiveStep(to)
                                          }
                                          arrows
                                          infinite={false}
                                          style={{ marginTop: 10, width: 320 }}
                                        >
                                          {product?.showAd && (
                                            <div>
                                              <a
                                                href={
                                                  product?.adBannerUrl || ""
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Image
                                                  src={getBannerUrl(
                                                    product?.adBannerUrl
                                                  )}
                                                  alt={
                                                    product?.adBannerUrl || ""
                                                  }
                                                  preview={false}
                                                  loading="lazy"
                                                  style={{
                                                    margin: 0,
                                                    height: "181px",
                                                    width: "100%",
                                                    borderRadius: 6,
                                                    objectFit: "cover",
                                                  }}
                                                />
                                              </a>
                                            </div>
                                          )}
                                          {product?.demoVideoUrl &&
                                            product?.demoVideoUrl.includes(
                                              "youtube.com"
                                            ) && (
                                              <div
                                                style={{ position: "relative" }}
                                              >
                                                <a
                                                  href={
                                                    product?.demoVideoUrl || ""
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  <PlayCircleOutlined
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: 60,
                                                      color: "grey",
                                                      opacity: 0.8,
                                                    }}
                                                  />
                                                  <Image
                                                    src={get_youtube_thumbnail(
                                                      product?.demoVideoUrl ||
                                                      "",
                                                      "high"
                                                    )}
                                                    preview={false}
                                                    loading="lazy"
                                                    alt={
                                                      product?.demoVideoUrl ||
                                                      ""
                                                    }
                                                    style={{
                                                      height: "181px",
                                                      width: "100%",
                                                      objectFit: "cover",
                                                    }}
                                                  />
                                                </a>
                                              </div>
                                            )}
                                        </Carousel>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </Space>
                                </Row>
                              </Row>
                            </>
                          ) : (
                            <></>
                          )}

                          {selectedTabId == 1 ? (
                            <>
                              <Flex
                                vertical
                                align="center"
                                justify="center"
                                style={{
                                  width: "100%",
                                  color: "black",
                                  marginTop: -22,
                                }}
                              >
                                <Row
                                  justify="center"
                                  style={{
                                    width: 323,
                                    margin: "24px 0",
                                    color: "black",
                                  }}
                                >
                                  <Col span={24}>
                                    {Object.keys(scrapData ?? {}).length ==
                                      0 ? (
                                      <Alert
                                        message={t("noDataFound")}
                                        type="warning"
                                        showIcon
                                      />
                                    ) : (
                                      <Card
                                        size="small"
                                        bodyStyle={{
                                          padding: "6px 10px",
                                        }}
                                      >
                                        <Form.Item
                                          label="Select Data"
                                          layout="vertical"
                                        >
                                          <Select
                                            value={selectedKeywordId}
                                            placeholder="Select Keyword"
                                            onChange={(value) =>
                                              setSelectedKeywordId(value)
                                            }
                                            style={{ width: "100%" }} // Ensures full width
                                            dropdownStyle={{
                                              maxHeight: 200, // Controls dropdown height
                                              overflow: "auto",
                                            }}
                                          >
                                            <Select.Option value="select">
                                              Select
                                            </Select.Option>
                                            {Object.keys(scrapData).map(
                                              (key) => (
                                                <Select.Option
                                                  key={key}
                                                  value={key}
                                                >
                                                  {scrapData[key].name}
                                                </Select.Option>
                                              )
                                            )}
                                          </Select>
                                        </Form.Item>

                                        {selectedKeywordId != "select" ? (
                                          <>
                                            <Row
                                              style={{
                                                marginTop: 16,
                                                color: "black",
                                                margin: "0px",
                                              }}
                                            >
                                              <Col>
                                                <Typography.Text color="black">
                                                {t("totalData")} :
                                                  {
                                                    (
                                                      scrapData[
                                                        selectedKeywordId
                                                      ]?.data ?? []
                                                    ).length
                                                  }
                                                </Typography.Text>
                                              </Col>
                                              <Divider
                                                style={{ margin: "2px 0" }}
                                              />
                                              <Col style={{ marginBottom: 10 }}>
                                                <Typography.Text color="black">
                                                   {t("lastDate")}:
                                                  {dateFormat(
                                                    scrapData[selectedKeywordId]
                                                      ?.createdAt,
                                                    true
                                                  )}
                                                </Typography.Text>
                                              </Col>
                                            </Row>
                                            <Row gutter={[16, 16]}>
                                              <Col span={12}>
                                                <Button
                                                style={{ color: "#fff", backgroundColor: "#2d49d8" }}
                                                  type="primary"
                                                  onClick={(e) =>
                                                    onDownloadScrapData()
                                                  }
                                                  block
                                                >
                                                  <DownloadOutlined /> {t("download")}
                                                </Button>
                                              </Col>

                                              <Col span={12}>
                                                <Button
                                                  type="primary"
                                                  danger
                                                  onClick={onDeleteScrapData}
                                                  block
                                                >
                                                  <DeleteOutlined /> {t("delete")}
                                                </Button>
                                              </Col>
                                            </Row>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        <Row justify="center">
                                          <Col
                                            span={24}
                                            style={{
                                              marginTop: 14,
                                              marginBottom: 10,
                                            }}
                                          >
                                            <Button
                                              type="default"
                                              danger
                                              onClick={onClearScrapData}
                                              block
                                            >
                                              <ClearOutlined /> {t("clearAll")}
                                            </Button>
                                          </Col>
                                        </Row>
                                      </Card>
                                    )}
                                  </Col>
                                </Row>
                              </Flex>
                            </>
                          ) : (
                            <></>
                          )}

                          {selectedTabId == 2 ? (
                            <Card
                              style={{
                                maxWidth: 320,
                                margin: "0 auto",
                                borderRadius: 10,
                              }}
                              bodyStyle={{
                                padding: "3px 8px",
                              }}
                            >
                              <Space
                                direction="vertical"
                                size="middle"
                                style={{ width: "100%" }}
                              >
                                <div>
                                  <Title level={5} style={{ margin: 0 }}>
                                  {t("helpMsg")}
                                  </Title>
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                   {t("contactWithEmail")}
                                  </Text>
                                </div>

                                <Card
                                  size="small"
                                  style={{
                                    background: "#fafafa",
                                    borderRadius: 8,
                                    margin: "-10px 0",
                                  }}
                                  bodyStyle={{
                                    padding: 4,
                                  }}
                                >
                                  <Space>
                                  <PhoneOutlined style={{ fontSize: 20 }} />
                                  <div>
                                    <Text strong>Phone</Text>
                                    <br />
                                    <Text>{licenseDetails?.phone || "-"}</Text>
                                  </div>
                                </Space>
                                </Card>

                                <Card
                                size="small"
                                style={{
                                  background: "#fafafa",
                                  borderRadius: 8,
                                }}
                                bodyStyle={{
                                  padding: 4,
                                }}
                              >
                                <Space>
                                  <MailOutlined style={{ fontSize: 20 }} />
                                  <div>
                                    <Text strong>Email</Text>
                                    <br />
                                    <Text>{licenseDetails?.email || "-"}</Text>
                                  </div>
                                </Space>
                              </Card>

                                  <Card
                                size="small"
                                style={{
                                  background: "#fafafa",
                                  borderRadius: 8,
                                  margin: "-10px 0",
                                }}
                                bodyStyle={{
                                  padding: 4,
                                }}
                              >
                                <Space>
                                  <GlobalOutlined style={{ fontSize: 20 }} />
                                  <div>
                                    <Text strong>Website</Text>
                                    <br />
                                    <Text style={{ fontSize: 12 }}>
                                      {licenseDetails?.website ||
                                        "https://digibulkmarketing.com/"}
                                    </Text>
                                  </div>
                                </Space>
                              </Card>


                                <div
                                // style={{ margin: "-10px 3px" }}
                                >
                                  <Title level={5} style={{ margin: 0 }}>
                                  {t("disclaimer")}
                                  </Title>
                                  <Paragraph
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                   {t("certified")}
                                  </Paragraph>
                                </div>
                              </Space>
                            </Card>
                          ) : (
                            <></>
                          )}
                        </Typography>
                      </Typography>
                    ) : (
                      <>
                        <Row gutter={[0, 0]} align="middle" justify="center">
                          <Col span={24}>
                            <Form
                              onFinish={onActivateSubmit}
                              layout="vertical"
                              style={{ padding: "0px 10px" }}
                            >
                              {licenseMessage && (
                                <Alert
                                  message={licenseMessage}
                                  type="warning"
                                  showIcon
                                  style={{ marginBottom: "16px" }}
                                />
                              )}

                              <Form.Item
                                label="Name"
                                name="name"
                                required
                                style={{ margin: "0px 0px" }}
                              >
                                <Input
                                  prefix={<UserOutlined />}
                                  placeholder="Enter Name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  status={errors.name ? "error" : ""}
                                />
                              </Form.Item>

                              <Form.Item
                                label={t("email")}
                                name="email"
                                required
                                style={{ margin: "6px 0" }}
                              >
                                <Input
                                  prefix={<MailOutlined />}
                                  placeholder="Enter Email Address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  status={errors.email ? "error" : ""}
                                />
                              </Form.Item>

                              <Form.Item
                                label={t("phone")}
                                name="phone"
                                required
                                style={{ margin: "6px 0" }}
                              >
                                <PhoneInput
                                  country="in"
                                  placeholder="Enter Phone Number"
                                  value={phone}
                                  onChange={(value) => setPhone(value)}
                                  inputProps={{
                                    style: {
                                      borderColor: errors.phone
                                        ? "red"
                                        : undefined,
                                      width: "100%",
                                    },
                                  }}
                                />
                              </Form.Item>

                              <Form.Item
                                label="City"
                                name="city"
                                required
                                style={{ margin: "6px 0" }}
                              >
                                <Input
                                  prefix={<HomeOutlined />}
                                  placeholder="Enter City Name"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  status={errors.city ? "error" : ""}
                                />
                              </Form.Item>

                              <Form.Item
                                name="country"
                                label="Country"
                                required
                                style={{ margin: "6px 0" }}
                                initialValue={"IN"}
                              >
                                <Select
                                  defaultActiveFirstOption
                                  showSearch
                                  placeholder="Select Country"
                                  onSearch={onSearch}
                                  optionLabelProp="label"
                                  value={country}
                                  onChange={(value) => setCountry(value)}
                                  status={errors.country ? "error" : ""}
                                >
                                  {countryList.map((x) => (
                                    <Option
                                      key={x.countryCode}
                                      value={x.countryNameEn}
                                      label={x.countryNameEn}
                                    >
                                      <span>
                                        <EnvironmentOutlined
                                          style={{ marginRight: 8 }}
                                        />
                                        {x.countryNameEn}
                                      </span>
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                label="License Key"
                                name="key"
                                required
                                style={{ margin: "6px 0" }}
                              >
                                <Input
                                  prefix={<KeyOutlined />}
                                  suffix={
                                    keyIsValid ? (
                                      <CheckCircleOutlined
                                        style={{ color: "green" }}
                                      />
                                    ) : (
                                      <CheckCircleOutlined
                                        style={{ color: "gray" }}
                                      />
                                    )
                                  }
                                  placeholder="Enter License Key"
                                  autoComplete="off"
                                  value={key}
                                  onChange={(e) => setKey(e.target.value)}
                                  status={
                                    errors.key
                                      ? "error"
                                      : keyIsValid
                                        ? "success"
                                        : ""
                                  }
                                />
                              </Form.Item>

                              {/* <Row
                                justify="center"
                                gutter={16}
                                style={{ marginBottom: 10 }}
                              >
                                <Col span={12}>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                  >
                                    Activate
                                  </Button>
                                </Col>
                                {product && rData?.active_shop && (
                                  <Col span={12}>
                                    <Button
                                      style={{
                                        border: "2px solid green",
                                        color: "green",
                                        textAlign: "center",
                                      }}
                                      type="link"
                                      href={product?.siteUrl || rData?.buy_url}
                                      block
                                    >
                                      Buy Now
                                    </Button>
                                  </Col>
                                )}
                              </Row> */}
                              <Row justify="center" gutter={16} style={{ marginBottom: 10 }}>
                                <Col span={12}>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    style={{ color: "#fff", backgroundColor: "#2d49d8" }}
                                  >
                                    <CheckCircleOutlined />   Activate
                                  </Button>
                                </Col>

                                {(product?.siteUrl || rData?.buy_url) && rData?.active_shop && (
                                  <Col span={12}>
                                    <Button
                                      type="link"
                                      block
                                      style={{
                                        border: '2px solid green',
                                        color: 'green',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <a
                                        href={product?.siteUrl || rData?.buy_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'block',
                                          width: '100%',
                                          height: '100%',
                                          textAlign: 'center',
                                          lineHeight: '32px', // Adjust height based on button height
                                          color: 'green',
                                          textDecoration: 'none',
                                        }}
                                      >
                                        <ShoppingOutlined />Buy Now
                                      </a>
                                    </Button>
                                  </Col>
                                )}
                              </Row>

                            </Form>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Typography>
                )}
              </>
            )}
          </>
        )}
        {showSecond && (
          <Card
            bordered
            style={{
              width: "100%",
              textAlign: "center",
              position: "absolute",
              bottom: 0,
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <Text>V1.1 | DBM Social Extractor</Text>
          </Card>
        )}
      {/* </ConfigProvider> */}
    </>
  );
};

export default FormComponent;
