import React, {Component, Fragment} from 'react';
import Fuse from 'fuse.js';
import fuzzysort from 'fuzzysort';
import FuzzySet from 'fuzzyset.js';
import { FlatList, Text, View, Button } from 'react-native';
import { ListItem } from 'react-native-elements'
import longdata from '../long_drugs2.json';
import shortdata from '../short_drugs2.json';
 
export default class Fuzzy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          med_search: '',
        };
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
      <ListItem
        title={item.name}
        subtitle={item.subtitle}
        leftAvatar={{ source: { uri: item.avatar_url } }}
        bottomDivider
      />
    )

    search(search) {
        const a = FuzzySet(shortdata);
        const search3 = (a.get(search));
        if (search3 != null) {
            console.log(search, search3[0]);
            return search3[0];
        }
        else{
            return null;
        }
        
    }

    searchLong(search) {
        if (longdata.includes(search)) {
            console.log("instant");
            return [1, search];
        }

        try{
            console.log("SEARCHING " + search + '\n');
            const fastresult = fuzzysort.go("hello", ["hello", "goodbye"]);
            const results = fuzzysort.go(search, longdata);
            const wtf = JSON.parse(JSON.stringify(results));
            // console.log(wtf[0]);
            //console.log(JSON.stringify(results));
            var fastArray = [wtf[0]["score"], wtf[0]["target"]];
            console.log(fastArray);
            return fastArray;
        }
        catch (e){
            console.log("ERROR: " + e);
            return([-10000, "NULL"]);
        }


    }

    // searchSort(search) {
    //     console.log("SEARCHING", search);
    //     const options = {
    //         threshold: -Infinity, // Don't return matches worse than this (higher is faster)
    //         limit: 1, // Don't return more results than this (lower is faster)
    //         allowTypo: true, // Allwos a snigle transpoes (false is faster)
    //         key: 'medicine_name', // For when targets are objects (see its example usage)

    //     }

    //     const searchy = fuzzysort.go(search, pillboxdata, {key: 'medicine_name'});
    //     //console.log(searchy);
    //     return searchy;


    //     const options1 = {
    //         keys: ['medicine_name'],
    //         threshold: 0.2,
    //         location: 0,
    //         distance: 100,
    //         includeScore: true,
    //     }
    //     const fuse1 = new Fuse(pillboxdata, options1);
        
    //     const search1 = fuse1.search(search);
    //     if (Array.isArray(search1) && search1.length) {
    //         return search1[0];
    //     }
    //     else {
    //     console.log("FIRST ARRAY EMPTY");

    //     console.log(shortdata.drugs);
    //     const options2 = {
    //         threshold: 0.4,
    //         location: 0,
    //         distance: 100,
    //     }
    //     const fuse2 = new Fuse(shortdata, options2);
    //     const search2 = fuse2.search(search);
    //     console.log(search, search2);
    //     return search2;

    //     }
    //     console.log("type: " + typeof(longdata));
    // }

    render() {
        return (
            <View>
                <Text>{this.search('fsjdf;sj')}</Text>
        </View>
        );
    }
}