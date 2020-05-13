import React, { useState } from 'react';
import {StyleSheet,View,Text } from 'react-native';
import {color} from './../config';
import {Card} from '@ui-kitten/components'
const SummaryCard = ({number, title, description, totalRoom}) =>{
    return (
        <Card style={styles.summary}>
            {totalRoom
            ? (<Text style={styles.summaryNumber}>{number}
            <Text style={styles.subText}> / {totalRoom}</Text>
            </Text>)
            : (<Text style={styles.summaryNumber}>{number}</Text>)}
            <Text style={styles.summaryLabel}>{title}</Text>
            <Text style={styles.summaryDes}>{description}</Text>
        </Card>
    )
}

const styles = StyleSheet.create({
    summary:{
        flexGrow:1,
        width:'48%',
        margin:'1%',
        alignItems:'center',
        borderColor:'#707070',
        borderStyle:'dashed',
        borderWidth:0.5,
    },
    summaryNumber:{
        fontSize:34,
        fontWeight:'bold',
        color:color.primary,
        marginBottom:5,
        textAlign:'center',
    },
    summaryLabel:{
        fontWeight:'600',
        marginBottom:5,
        textAlign:'center',
    },
    summaryDes:{
        color:'#808080',
        textAlign:'center'
    },
    subText:{
        color:'#B7B7B7',
        fontSize:17
    }
})

export default SummaryCard;