import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Image,View} from 'react-native';
import {Icon} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {color} from './../../config';
const NavLink = ({title, routeName,imageUrl, borderBottom}) =>{
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress = {() => navigation.navigate({name:routeName})}>
            <View style={!borderBottom 
            ? {...styles.wrap}
            : {...styles.wrap,borderBottomWidth:.5,borderBottomColor:'#e1e1e1'}
            }>
                <View style={styles.titleWrap}>
                    {imageUrl ? (<Image source={imageUrl} style={styles.image}/>) : null}
                    <Text style={styles.text}>{title}</Text>
                </View>
                <Icon name="chevron-right" fill={color.primary} style={styles.icon}/>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrap:{
        paddingVertical:15,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    title:{
        flexGrow:1
    },
    titleWrap:{
        flexDirection:'row',
        alignItems:'center'
    }, 
    icon:{
        width:25,
        height:25,
    },
    image:{
        marginRight:10
    }
})
export default NavLink;