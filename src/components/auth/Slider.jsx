import React, { Component } from "react";
import Slider from "react-slick";
import './component.scss'

export default class SimpleSlider extends Component {
    render() {
        const settings = {
            dots: true,
            infinite: true,
            arrows: false,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 3000,
            slidesToShow: 1,
            slidesToScroll: 1,
            lazyLoad: true,
            animation: false,
            cssEase: 'ease',
            fade: true
        };
        return (
            <div className="slider">
                <Slider {...settings}>
                    <div>
                        <h3 style={{'font-size': '25px'}}>Satu Integrasi Untuk
                            Semua Kebutuhan Anda</h3>
                        <p>Berbagai jenis aplikasi yang mendukung bisnis skala umkm dan insitusi besar juga terintegrasi dengan platform Awan Digital lainnya</p>
                    </div>
                    <div>
                        <h3 style={{'font-size': '25px'}}>Pengeluaran Untuk Solusi Teknologi yang Lebih Cerdas</h3>
                        <p style={{'font-size': '15px'}}>Fokus kepada bisnis inti dan hemat biaya pengembangan aplikasi berulang melalui solusi cloud dan bundling platform Awan Digital</p>
                    </div>
                    <div>
                        <h3 style={{'font-size': '25px'}}>Experience Pelanggan Yang Lebih Baik</h3>
                        <p>Berikan pengalaman terbaik kepada pelanggan dengan berbagai solusi Awan Digital</p>
                    </div>
                </Slider>
            </div>
        );
    }
}