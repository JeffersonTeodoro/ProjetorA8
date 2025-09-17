import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrentPrice from './src/components/CurrentPrice';
import HistoryGraphic from './src/components/HistoryGraphic';
import QuotationList from './src/components/QuotationsList';

function addZero(number) {
    return number <= 9 ? "0" + number : number;
}

function url(qtdDays) {
    const date = new Date();
    const end_Date = `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;
    date.setDate(date.getDate() - qtdDays);
    const start_Date = `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;
    return `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start_Date}&end=${end_Date}`;
}

async function getListCoins(url) {
    let response = await fetch(url);
    let returnApi = await response.json();
    const queryCoinsList = Object.keys(returnApi.bpi).map((key) => ({
        data: key.split("-").reverse().join("/"),
        valor: returnApi.bpi[key],
    }));
    return queryCoinsList.reverse();
}

async function getPriceCoinsGraphic(url) {
    let responseG = await fetch(url);
    let returnApiG = await responseG.json();
    return Object.values(returnApiG.bpi);
}

export default function App() {
    const [coinsList, setCoinsList] = useState([]);
    const [coinsGraphicList, setCoinsGraphicList] = useState([0]);
    const [days, setDays] = useState(30);
    const [updateData, setUpdateData] = useState(true);
    const [price, setPrice] = useState();

    function updateDay(number) {
        setDays(number);
        setUpdateData(true);
    }

    function priceCotation() {
        if (coinsGraphicList.length > 0) {
            setPrice(coinsGraphicList[coinsGraphicList.length - 1]);
        }
    }

    useEffect(() => {
        getListCoins(url(days)).then(setCoinsList);
        getPriceCoinsGraphic(url(days)).then(setCoinsGraphicList);
        priceCotation();
        if (updateData) setUpdateData(false);
    }, [updateData]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#0000ff" barStyle="light-content" />
            <CurrentPrice lastCotation={price} />
            <HistoryGraphic infoDataGraphic={coinsGraphicList} />
            <QuotationList filterDay={updateDay} listTransactions={coinsList} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
});

