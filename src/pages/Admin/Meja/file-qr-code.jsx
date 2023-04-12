import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { useLocation } from 'react-router-dom'
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer'
import { baseUrlFrontEnd } from '../../../utils/strings'
import Logo from '../../../assets/images/logo/SiResto.png'
import axios from '../../../utils/axios'

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'black'
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        color: 'black'
    },
    text: {
        fontSize: 8,
        textAlign: "center",
        fontFamily: "Inter",
        display: 'block',
        color: 'black'
    },
    textDescription: {
        fontSize: 6,
        textAlign: "center",
        fontFamily: "Inter",
        display: 'block',
        color: 'black'
    },
    textNoMeja: {
        fontSize: 12,
        textAlign: "center",
        display: 'block',
        fontFamily: "Inter",
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'black'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        paddingBottom: 4,
        marginBottom: 20,
        textAlign: "center",
        color: "grey",
        display: 'block',
        width: '100%',
        borderBottomStyle: 'double',
        borderBottomWidth: 3,
        borderBottomColor: 'black'
    },
    pageNumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
    },
    viewQrcode: {
        marginTop: 14,
        marginBottom: 20
    }
})

export default function FileQrCode() {
    let { search } = useLocation()

    const query = new URLSearchParams(search)
    const uuid = query.get('_code')
    const resto = query.get('_r')
    const noMeja = query.get('_n')

    useEffect(() => {
        window.print()
        window.focus()
    }, [])

    return (
        <Document>
            <Page style={styles.body}>
                <Text fixed></Text>
                <Image src={Logo} style={styles.image}/>
                <View style={styles.header}>
                    <Text style={styles.text}>No Telepon : 6285-1111-33442</Text>
                    <Text style={styles.text}>Jln. Hos Cokroaminoto</Text>
                </View>
                <View>
                    <Text style={styles.text}>SELF ORDERING</Text>
                    <Text style={styles.textNoMeja}>No Meja : {noMeja}</Text>
                </View>
                <View style={styles.viewQrcode}>
                    <QRCode size={120} value={baseUrlFrontEnd + `home/${uuid}`}/>
                </View>
                <View>
                    <Text fixed style={styles.textDescription}>Scan QR Code dengan Smartphone anda, setelah itu
                    akses link dari hasil QR Code Tersebut</Text>
                </View>
            </Page>
        </Document>
    )
}
