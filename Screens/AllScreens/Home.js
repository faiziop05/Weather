import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  ScrollViewBase,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
const screenWidth = Dimensions.get("screen").width;
import SearchBar from "../../Components/SearchBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../../Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
const FetchSearchCity = async (city) => {
  const url = `https://weatherapi-com.p.rapidapi.com/search.json?q=${city}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f740c5b33emshc8a7cf741a41e44p1a11cbjsncd2737c5e280",
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

const fetchForcastDetails = async (location) => {
  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f740c5b33emshc8a7cf741a41e44p1a11cbjsncd2737c5e280",
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
const Home = () => {
  const [SeachCity, SetSearchCity] = useState("");
  const [fetchedCities, setFetchedCities] = useState([]);
  const [iscitySelected, setIsCitySelected] = useState(true);
  const [SelectedCity, setSelectedCity] = useState({});
  const [FetchedSelectedCityData, setSFetchedelectedCityData] = useState({});
  const [forcast, setForcast] = useState({});

  useEffect(() => {
    const fetchStoredCity = async () => {
      try {
        const storedCity = await AsyncStorage.getItem("SelectedCity");
        let newProduct = storedCity ? JSON.parse(storedCity) : null;
        const location = newProduct.name;

        const res = await fetchForcastDetails(location);
        setSFetchedelectedCityData(res);
      } catch (error) {
        console.error("Error retrieving or parsing the city: ", error);
      }
    };
    fetchStoredCity();
  }, []);

  const handleSearch = async () => {
    try {
      setIsCitySelected(false);
      const res = await FetchSearchCity(SeachCity);
      setFetchedCities(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCityClick = async (data) => {
    await AsyncStorage.setItem("SelectedCity", JSON.stringify(data));
    const location = `${data.lat},${data.lon}`;

    const res = await fetchForcastDetails(location);
    setSFetchedelectedCityData(res);
    setSelectedCity(data);
    setIsCitySelected(true);
    SetSearchCity("");
  };
  //   console.log(FetchedSelectedCityData.forecast?.forecastday[0].hour[0]);

  const RenderItem = ({ data }) => {
    return (
      <View style={styles.searchedItemConatiner}>
        <View style={styles.cityCountryWrapper}>
          <View style={styles.locationCityTextIconWrapper}>
            <Text style={styles.CityName}>{data.name}</Text>
            <FontAwesome name="location-arrow" size={24} color="white" />
          </View>
          <Text style={styles.regionName}>{data.region}</Text>
        </View>
        <View>
          <Text style={styles.countryName}>{data.country}</Text>
        </View>
      </View>
    );
  };
  const convertToAmPm = (time) => {
    const date = new Date(time);
    const currentHour = new Date(time).getHours();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = currentHour >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  const ForcastRenderItem = ({ data }) => {
    // Example usage
    const formattedTime = convertToAmPm(data.time);

    return (
      <View style={styles.HourlyForcastInnerContainer}>
        <Text style={styles.timeText}>{formattedTime}</Text>
        <Image
          width={70}
          height={70}
          resizeMode="contain"
          source={{
            uri: `https:${data.condition?.icon}`,
          }}
        />
        <View style={styles.hourlyTempWrapper}>
          <Text style={styles.HourlyTemp}>{data.temp_c}</Text>
          <Entypo name="circle" size={5} color="white" />
        </View>
      </View>
    );
  };
  console.log(FetchedSelectedCityData.forecast?.forecastday[0]?.astro?.sunrise);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.Container}>
        <View style={styles.searchbarContainer}>
          <SearchBar
            onBackspacePress={handleSearch}
            value={SeachCity}
            onchangetext={(value) => SetSearchCity(value)}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatlistwrpper}>
          {!iscitySelected && SeachCity ? (
            <FlatList
              horizontal
              contentContainerStyle={{
                display: "flex",
                flexDirection: "column",
              }}
              data={fetchedCities}
              renderItem={(data) => (
                <TouchableOpacity onPress={() => handleCityClick(data.item)}>
                  <RenderItem data={data.item} />
                </TouchableOpacity>
              )}
            />
          ) : (
            <View>
              <View style={styles.CityIconTempWrapper}>
                <Text style={styles.MainCityName}>
                  {FetchedSelectedCityData?.location?.name}
                </Text>
                <Text style={styles.CurrentConditionText}>
                  {FetchedSelectedCityData.current?.condition?.text}
                </Text>
                <Image
                  width={100}
                  height={100}
                  resizeMode="contain"
                  source={{
                    uri: `https:${FetchedSelectedCityData.current?.condition?.icon}`,
                  }}
                />
                <View style={styles.CurrenttempWrapper}>
                  <Text style={styles.Currenttemp}>
                    {FetchedSelectedCityData.current?.temp_c}
                  </Text>
                  <Entypo name="circle" size={12} color="white" />
                </View>
              </View>

              <View style={styles.HourlyForcastConatiner}>
                <Text style={styles.HourlyForcastHeading}>Hourly Forcast</Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={FetchedSelectedCityData.forecast?.forecastday[0]?.hour}
                  renderItem={(data) => {
                    return <ForcastRenderItem data={data.item} />;
                  }}
                />
              </View>
              <View style={styles.AllSqauerBoxsWrapper}>
                {/* <View> */}

                <View style={styles.SquareConatiner}>
                  <Text style={styles.SunrizeHeading}>Sunrise:</Text>
                  <Text style={styles.SunrizeTime}>
                    {
                      FetchedSelectedCityData.forecast?.forecastday[0]?.astro
                        ?.sunrise
                    }
                  </Text>
                  <Text style={styles.sunSetTime}>
                    Sunset:
                    {
                      FetchedSelectedCityData.forecast?.forecastday[0]?.astro
                        ?.sunset
                    }
                  </Text>
                </View>

                <View style={styles.SquareConatiner}>
                  <Text style={styles.SunrizeHeading}>Moonrise:</Text>
                  <Text style={styles.SunrizeTime}>
                    {
                      FetchedSelectedCityData.forecast?.forecastday[0]?.astro
                        ?.moonrise
                    }
                  </Text>
                  <Text style={styles.sunSetTime}>
                    Moon Illumination:
                    {
                      FetchedSelectedCityData.forecast?.forecastday[0]?.astro
                        ?.moon_illumination
                    }
                    %
                  </Text>
                  <Text style={styles.sunSetTime}>
                    Moonset:
                    {
                      FetchedSelectedCityData.forecast?.forecastday[0]?.astro
                        ?.moonset
                    }
                  </Text>
                </View>

                <View style={styles.SquareConatiner}>
                  <Text style={styles.SunrizeHeading}>Humidity:</Text>
                  <Text style={styles.SunrizeTime}>
                    {FetchedSelectedCityData.current?.humidity}%
                  </Text>
                  <Text style={styles.sunSetTime}>
                    Due Point is {FetchedSelectedCityData.current?.dewpoint_c}{" "}
                    Degree.
                  </Text>
                </View>

                <View style={styles.SquareConatiner}>
                  <Text style={styles.SunrizeHeading}>Visibility: </Text>
                  <Text style={styles.SunrizeTime}>
                    {FetchedSelectedCityData.current?.vis_km} Mil
                  </Text>
                </View>

                {/* </View> */}
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#001133",
  },
  Container: {
    // backgroundColor: "#001133",
    paddingTop: 70,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 30,
  },
  searchbarContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "3%",
  },
  searchBtn: {
    width: screenWidth / 6,
    height: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  searchBtnText: {
    color: "#001133",
    fontWeight: "700",
    fontSize: 15,
  },
  searchedItemConatiner: {
    backgroundColor: Colors.lightBackgorund,
    marginHorizontal: "3%",
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: screenWidth / 1.065,
  },
  cityCountryWrapper: {},
  locationCityTextIconWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  CityName: {
    color: Colors.lightFontColor,
    fontSize: 20,
    fontWeight: "900",
    marginRight: 10,
  },
  regionName: {
    color: Colors.lightFontColor,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 5,
  },
  countryName: {
    color: Colors.lightFontColor,
    fontSize: 20,
    fontWeight: "900",
    marginRight: 10,
    width: 120,
  },
  flatlistwrpper: {
    height: "98%",
  },
  CityIconTempWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  MainCityName: {
    color: Colors.lightFontColor,
    fontSize: 26,
    fontWeight: "600",
    marginTop: 40,
  },
  CurrentConditionText: {
    color: Colors.lightFontColor,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
  },
  Currenttemp: {
    color: Colors.lightFontColor,
    fontSize: 55,
    fontWeight: "600",
    marginTop: 10,
  },
  CurrenttempWrapper: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 12,
  },
  HourlyForcastConatiner: {
    backgroundColor: Colors.lightBackgorund,
    padding: 20,
    borderRadius: 10,
    marginTop: "30%",
    marginHorizontal: "3%",
  },
  HourlyForcastInnerContainer: {
    alignItems: "center",
  },
  timeText: {
    color: Colors.lightFontColor,
    // padding: 5,
    fontWeight: "100",
    marginBottom: 15,
  },
  hourlyTempWrapper: {
    display: "flex",
    flexDirection: "row",
    marginTop: 15,
  },
  HourlyTemp: {
    color: Colors.lightFontColor,
    fontSize: 20,
    padding: 3,
  },
  HourlyForcastHeading: {
    color: Colors.lightFontColor,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 18,
  },
  SquareConatiner: {
    backgroundColor: Colors.lightBackgorund,
    width: screenWidth / 2.2,
    height: screenWidth / 2.5,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    display: "flex",
    flexDirection: "column",
    // justifyContent:"space-around"
},
AllSqauerBoxsWrapper: {
      marginTop:10,
    marginHorizontal: "3%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap:"wrap"
  },
  SunrizeHeading: {
    color: Colors.lightFontColor,
    fontSize: 20,
    fontWeight: "600",
  },
  SunrizeTime: {
    color: Colors.lightFontColor,
    fontSize: 35,
    fontWeight: "400",
    marginTop: 20,
  },
  sunSetTime: {
    color: Colors.lightFontColor,
    fontSize: 15,
    fontWeight: "400",
    alignSelf: "flex-end",
    top: 30,
  },
});
