import { Injectable } from "@angular/core";
import pdfMake from 'pdfmake-thai/build/pdfmake';
import pdfFonts from 'pdfmake-thai/build/vfs_fonts';
import { InDelivery } from "src/app/authentication/financial-document/components/delivery/delivery.interface";
import { InInvoiceDocument } from "src/app/authentication/financial-document/components/invoice-document/invoice-document.interface";
import { InInvoice } from "src/app/authentication/financial-document/components/invoice/invoice.interface";
import { AlertService } from "./alert.service";
import { HttpClient } from "@angular/common/http";
import { InMessageMemos } from "src/app/authentication/financial-document/components/message-memos/message-memos.interface";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root',
})

export class PdfService {
    pdfMake: any;
    private img = getBase64ImageFromURL('assets/images/cavalry-v1.jpg');
    constructor(
        private alert: AlertService,
    ) {
    }

    async convertMount(m: string) {
        if (m == '1' || m == '01') {
            return 'มกราคม';
        }
        if (m == '2' || m == '02') {
            return 'กุมภาพันธ์';
        }
        if (m == '3' || m == '03') {
            return 'มีนาคม';
        }
        if (m == '4' || m == '04') {
            return 'เมษายน';
        }
        if (m == '5' || m == '05') {
            return 'พฤษภาคม';
        }
        if (m == '6' || m == '06') {
            return 'มิถุนายน';
        }
        if (m == '7' || m == '07') {
            return 'กรกฎาคม';
        }
        if (m == '8' || m == '08') {
            return 'สิงหาคม';
        }
        if (m == '9' || m == '09') {
            return 'กันยายน';
        }
        if (m == '10') {
            return 'ตุลาคม';
        }
        if (m == '11') {
            return 'พฤศจิกายน';
        }
        if (m == '12') {
            return 'ธันวาคม';
        }
        else {
            this.alert.notify('พบข้อผิดพลาดบางอย่าง');
            return 'พบข้อผิดพลาดบางอย่าง'
        }
    }

    async loadPdfMaker() {
        try {
            if (!this.pdfMake) {
                const pdfMakeModule = await import('pdfmake-thai/build/pdfmake');
                const pdfFontsModule = await import('pdfmake-thai/build/vfs_fonts');
                this.pdfMake = pdfMakeModule.default;
                this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
                this.pdfMake.fonts = {
                    Roboto: {
                        normal: 'Roboto-Regular.ttf',
                        bold: 'Roboto-Medium.ttf',
                        italics: 'Roboto-Italic.ttf',
                        bolditalics: 'Roboto-MediumItalic.ttf',
                    },
                    Sarabun: {
                        normal: "THSarabunNew.ttf",
                        bold: "THSarabunNew-Bold.ttf",
                        italics: "THSarabunNew-Italic.ttf",
                        bolditalics: "THSarabunNew-BoldItalic.ttf",
                    },
                    PSU: {
                        // normal: "DB ChuanPim PSU Li v3.2.1.ttf",
                        normal: "DB ChuanPim PSU v3.2.1.ttf",
                        // normal:"DB ChuanPim PSU Demi v3.2.1.ttf",
                        bold: "DB ChuanPim PSU Bd v3.2.1.ttf",
                        italics: "DB ChuanPim PSU Bd It v3.2.1.ttf",
                        bolditalics: "DB ChuanPim PSU Bd It v3.2.1.ttf",
                    }
                }
            }
        } catch (err) {
            return this.alert.notify(`function loadPdfMaker : ` + err.Message)
        }

    }



    // async generatePdf() {
    //     await this.loadPdfMaker();
    //     const def = {
    //         content: [
    //             'หกดหกดหกด',
    //             '\n',
    //             'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
    //         ],
    //         defaultStyle: {
    //             font: "Sarabun",
    //             fontSize: 16,
    //         }
    //     }
    //     this.pdfMake.createPdf(def).open();
    // }

    //สร้างใบส่งของ
    async generateDelivery(model: InDelivery) {
        await this.loadPdfMaker();
        try {
            let position = model.forwarder_position.split(' ');
            // console.log(position);

            // แปลงวันที่เป็น วันที่พุทธศักราช
            let date = model.date.split("-");
            let y_eng = parseInt(date[0]);
            let y_th = y_eng + 543;
            let yy = y_th.toString();
            let m = date[1].toString();
            let mm = await this.convertMount(m);
            let dd = date[2].toString();
            // console.log(` ตัวแปรวันที่ : ${model.date} \n ตัวแปรหลังจาก แบ่ง : ${date} , ${date[0]} , ${date[1]} , ${date[2]} \n dd: ${dd} \n mm : ${mm} \n yy : ${yy}`);
            let str_date = dd + ' ' + mm + ' ' + yy + ' ';

            //รวมจำนวนเงิน
            // console.log('detail2:' + typeof model.product_detail_2 + '\n number2: ' + model.product_number_2 + '\n product2: ' + model.product_prize_2);
            let product_prize_1 = model.product_prize_1.toFixed(2);
            let total_money_th_1 = (parseFloat(`${model.product_number_1}`) * parseFloat(`${model.product_prize_1}`)).toFixed(2);
            let total_money = total_money_th_1;
            //แปลงจำนวนเงินเป็นตัวหนังสือ
            let thaibath = ArabicNumberToText(total_money);

            if (
                model.product_detail_2 != '' ||
                model.product_number_2 != null ||
                model.product_prize_2 != null
            ) {
                let product_prize_2 = model.product_prize_2.toFixed(2);
                let total_money_th_2 = (parseFloat(`${model.product_number_2}`) * parseFloat(`${model.product_prize_2}`)).toFixed(2);
                let total_money_th = ((parseFloat(`${model.product_number_1}`) * parseFloat(`${model.product_prize_1}`)) + (parseFloat(`${model.product_number_2}`) * parseFloat(`${model.product_prize_2}`))).toFixed(2);
                total_money = total_money_th;
                thaibath = ArabicNumberToText(total_money);
                var docDefinition = {
                    content: [
                        {
                            text: 'ใบส่งของ \n',
                            font: 'PSU',
                            bold: true,
                            fontSize: 22,
                            alignment: 'center',
                        },
                        {
                            columns: [
                                {
                                    width: '70%',
                                    text: `สำนักนวัตกรรมดิจิทัลและระบบอัจฉริยะ มหาวิทยาลัยสงขลานครินทร์
                                15 ถนนกาญจนวณิชย์ ตำบลหาดใหญ่ อำเภอหาดใหญ่
                                จังหวัดสงขลา 90110 
                                โทร. 0-7428-2102, 0-7428-2073 โทรสาร 074 282 111 
                                อีเมล : naowarat.s@psu.ac.th, orathai.b@psu.ac.th`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 40,
                                //     text: '\u200b',
                                //     font: 'Roboto',

                                // },
                                {
                                    width: '30%',
                                    text: `เลขที่ \t 1/2564 \n วันที่ ${str_date}`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 10,
                                //     text: '\u200b',
                                //     font: 'Roboto',
                                // }
                            ],
                            // columnGap: 10,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            // style: 'tableExample',
                            table: {
                                headerRows: 1,
                                // heights: ['*', 100, '*'],
                                widths: [231, 222],
                                // dontBreakRows: true,
                                // keepWithHeaderRows: 1,
                                body: [
                                    // [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                                    [
                                        // [{text: 'ที่อยู่ ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        // [{text: 'เงื่อนไขการเสนอราคา ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        {
                                            text: [
                                                {
                                                    text: 'ที่อยู่ ',
                                                    font: 'PSU',
                                                    fontSize: 16,
                                                    bold: true
                                                },
                                                {
                                                    text: `${model.address}`,
                                                    font: 'PSU',
                                                    fontSize: 16
                                                },
                                            ]
                                        },
                                        [
                                            {
                                                text: 'เงื่อนไขการเสนอราคา \t',
                                                font: 'PSU',
                                                fontSize: 16,
                                                bold: true
                                            },
                                            {
                                                text: `กำหนดชำระเงิน \t ${model.payment_due} \t วัน`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                            {
                                                text: `กำหนดยืนราคา \t ${model.prize_stand} \t วัน`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                            {
                                                text: `กำหนดรับประกัน \t ${model.guarantee} \t ปี`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                        ]


                                    ]
                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: ['*', 100, 100, '*'],
                                widths: [231, 52, 76, 76],
                                body: [
                                    [
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รายละเอียดสินค้า',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'จำนวนเงิน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'ราคาต่อหน่วย',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รวมเงิน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        {
                                            text: `1. ${model.product_detail_1}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(model.product_number_1.toString())}`,
                                            style: 'text_normal',

                                        },
                                        {
                                            text: `${addCommas(product_prize_1)}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(total_money_th_1)}`,
                                            style: 'text_normal',

                                        }
                                    ],
                                    [
                                        {
                                            text: `2. ${model.product_detail_2}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(model.product_number_2.toString())}`,
                                            style: 'text_normal',

                                        },
                                        {
                                            text: `${addCommas(product_prize_2)}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(total_money_th_2)}`,
                                            style: 'text_normal',

                                        }
                                    ],
                                    [
                                        {
                                            text: `(${thaibath})`,
                                            style: 'text_normal',
                                            colSpan: 3,
                                            alignment: 'left',
                                        },
                                        {},
                                        {},
                                        {
                                            text: `${addCommas(total_money)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        }
                                    ],

                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: [100],
                                widths: [462],
                                body: [
                                    [
                                        [
                                            {
                                                columns: [
                                                    {
                                                        width: '55%',
                                                        text: 'ผู้รับของ \n\n (ลงชื่อ).................................................. \n \u200b \t (..................................................) \n ตำแหน่ง.................................................. \n วันที่..................................................',
                                                        style: 'text_normal',
                                                    },
                                                    {
                                                        width: '*',
                                                        text: [
                                                            {
                                                                text: `ผู้ส่งของ \n\n (ลงชื่อ)........................................ \n \u200b \t \t (${model.forwarder})`,
                                                                style: 'text_normal',
                                                            },
                                                            {
                                                                text: `\n \u200b \t    ${position[0]} `,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                            {
                                                                text: `   ${position[1]} \n \u200b \t   มหาวิทยาลัยสงขลานครินทร์`,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                        ],

                                                    },
                                                ],
                                                columnGap: 0,
                                            },

                                        ]
                                    ],



                                ],

                            },
                        }
                    ],
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    width: 595.3,
                    height: 841.9,
                    // [left, top, right, bottom]
                    // pageMargins: [31.7, 10, 25, 10],
                    pageMargins: [89.85, 19.85, 72, 45.35],
                    styles: {
                        text_normal: {
                            fontSize: 16,
                            font: 'PSU',
                        },
                        text_bole: {
                            fontSize: 16,
                            font: 'PSU',
                            bold: true,
                        }
                    }
                };
            }
            else {
                var docDefinition = {
                    content: [
                        {
                            text: 'ใบส่งของ \n',
                            font: 'PSU',
                            bold: true,
                            fontSize: 22,
                            alignment: 'center',
                        },
                        {
                            columns: [
                                {
                                    width: '70%',
                                    text: `สำนักนวัตกรรมดิจิทัลและระบบอัจฉริยะ มหาวิทยาลัยสงขลานครินทร์
                                15 ถนนกาญจนวณิชย์ ตำบลหาดใหญ่ อำเภอหาดใหญ่
                                จังหวัดสงขลา 90110 
                                โทร. 0-7428-2102, 0-7428-2073 โทรสาร 074 282 111 
                                อีเมล : naowarat.s@psu.ac.th, orathai.b@psu.ac.th`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 40,
                                //     text: '\u200b',
                                //     font: 'Roboto',

                                // },
                                {
                                    width: '30%',
                                    text: `เลขที่ \t 1/2564 \n วันที่ ${str_date}`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 10,
                                //     text: '\u200b',
                                //     font: 'Roboto',
                                // }
                            ],
                            // columnGap: 10,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            // style: 'tableExample',
                            table: {
                                headerRows: 1,
                                // heights: ['*', 100, '*'],
                                widths: [231, 222],
                                // dontBreakRows: true,
                                // keepWithHeaderRows: 1,
                                body: [
                                    // [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                                    [
                                        // [{text: 'ที่อยู่ ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        // [{text: 'เงื่อนไขการเสนอราคา ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        {
                                            text: [
                                                {
                                                    text: 'ที่อยู่ ',
                                                    font: 'PSU',
                                                    fontSize: 16,
                                                    bold: true
                                                },
                                                {
                                                    text: `${model.address}`,
                                                    font: 'PSU',
                                                    fontSize: 16
                                                },
                                            ]
                                        },
                                        [
                                            {
                                                text: 'เงื่อนไขการเสนอราคา \t',
                                                font: 'PSU',
                                                fontSize: 16,
                                                bold: true
                                            },
                                            {
                                                text: `กำหนดชำระเงิน \t ${model.payment_due} \t วัน`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                            {
                                                text: `กำหนดยืนราคา \t ${model.prize_stand} \t วัน`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                            {
                                                text: `กำหนดรับประกัน \t ${model.guarantee} \t ปี`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                        ]


                                    ]
                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: ['*', 200, '*'],
                                widths: [231, 52, 76, 76],
                                body: [
                                    [
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รายละเอียดสินค้า',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'จำนวนเงิน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'ราคาต่อหน่วย',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รวมเงิน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        {
                                            text: `${model.product_detail_1}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(model.product_number_1.toString())}`,
                                            style: 'text_normal',

                                        },
                                        {
                                            text: `${addCommas(product_prize_1)}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(total_money_th_1)}`,
                                            style: 'text_normal',

                                        }
                                    ],
                                    [
                                        {
                                            text: `(${thaibath})`,
                                            style: 'text_normal',
                                            colSpan: 3,
                                            alignment: 'left',
                                        },
                                        {},
                                        {},
                                        {
                                            text: `${addCommas(total_money)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        }
                                    ],

                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: [100],
                                widths: [462],
                                body: [
                                    [
                                        [
                                            {
                                                columns: [
                                                    {
                                                        width: '55%',
                                                        text: 'ผู้รับของ \n\n (ลงชื่อ).................................................. \n \u200b \t (..................................................) \n ตำแหน่ง.................................................. \n วันที่..................................................',
                                                        style: 'text_normal',
                                                    },
                                                    {
                                                        width: '*',
                                                        text: [
                                                            {
                                                                text: `ผู้ส่งของ \n\n (ลงชื่อ)........................................ \n \u200b \t \t (${model.forwarder})`,
                                                                style: 'text_normal',
                                                            },
                                                            {
                                                                text: `\n \u200b \t    ${position[0]} `,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                            {
                                                                text: `   ${position[1]} \n \u200b \t   มหาวิทยาลัยสงขลานครินทร์`,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                        ],

                                                    },
                                                ],
                                                columnGap: 0,
                                            },

                                        ]
                                    ],



                                ],

                            },
                        }
                    ],
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    width: 595.3,
                    height: 841.9,
                    // [left, top, right, bottom]
                    // pageMargins: [31.7, 10, 25, 10],
                    pageMargins: [89.85, 19.85, 72, 45.35],
                    styles: {
                        text_normal: {
                            fontSize: 16,
                            font: 'PSU',
                        },
                        text_bole: {
                            fontSize: 16,
                            font: 'PSU',
                            bold: true,
                        }
                    }
                };

            }

            this.alert.notify('สร้างฟอร์มสำเร็จ', 'info');
            this.pdfMake.createPdf(docDefinition).open();

        } catch (err) {
            this.alert.notify(`function generateDelivery : ` + err.Message);

        }

    }

    // สร้างใบแจ้งหนี้
    async generateInvoice(model: InInvoice) {
        try {
            // console.log(model.forwarder);
            // console.log(model.forwarder_position);
            let position = model.forwarder_position.split(' ');
            await this.loadPdfMaker();
            // แปลงวันที่เป็น วันที่พุทธศักราช
            let date = model.date.split("-");
            let y_eng = parseInt(date[0]);
            let y_th = y_eng + 543;
            let yy = y_th.toString();
            let m = date[1].toString();
            let mm = await this.convertMount(m);
            let dd = date[2].toString();
            // console.log(` ตัวแปรวันที่ : ${model.date} \n ตัวแปรหลังจาก แบ่ง : ${date} , ${date[0]} , ${date[1]} , ${date[2]} \n dd: ${dd} \n mm : ${mm} \n yy : ${yy}`);
            let str_date = dd + ' ' + mm + ' ' + yy + ' ';

            //รวมจำนวนเงิน
            // console.log('detail2:' + typeof model.product_detail_2 + '\n number2: ' + model.product_number_2 + '\n product2: ' + model.product_prize_2);
            let product_prize_1 = model.product_prize_1.toFixed(2);
            let total_money_th_1 = (parseFloat(`${model.product_number_1}`) * parseFloat(`${model.product_prize_1}`)).toFixed(2);
            let total_money = total_money_th_1;
            //แปลงจำนวนเงินเป็นตัวหนังสือ
            let thaibath = ArabicNumberToText(total_money);

            if (
                model.product_detail_2 != '' ||
                model.product_number_2 != null ||
                model.product_prize_2 != null
            ) {
                // console.log('2 มีค่า');
                let product_prize_2 = model.product_prize_2.toFixed(2);
                let total_money_th_2 = (parseFloat(`${model.product_number_2}`) * parseFloat(`${model.product_prize_2}`)).toFixed(2);
                let total_money_th = ((parseFloat(`${model.product_number_1}`) * parseFloat(`${model.product_prize_1}`)) + (parseFloat(`${model.product_number_2}`) * parseFloat(`${model.product_prize_2}`))).toFixed(2);
                total_money = total_money_th;
                thaibath = ArabicNumberToText(total_money);
                var docDefinition = {
                    content: [
                        {
                            text: 'ใบแจ้งหนี้ \n',
                            font: 'PSU',
                            bold: true,
                            fontSize: 22,
                            alignment: 'center',
                        },
                        {
                            columns: [
                                {
                                    width: '70%',
                                    text: `สำนักนวัตกรรมดิจิทัลและระบบอัจฉริยะ มหาวิทยาลัยสงขลานครินทร์
                                15 ถนนกาญจนวณิชย์ ตำบลหาดใหญ่ อำเภอหาดใหญ่
                                จังหวัดสงขลา 90110 
                                โทร. 0-7428-2102, 0-7428-2073 โทรสาร 074 282 111 
                                อีเมล : naowarat.s@psu.ac.th, orathai.b@psu.ac.th`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 40,
                                //     text: '\u200b',
                                //     font: 'Roboto',

                                // },
                                {
                                    width: '30%',
                                    text: `เลขที่ \t 2/2564 \n วันที่ ${str_date}`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 10,
                                //     text: '\u200b',
                                //     font: 'Roboto',
                                // }
                            ],
                            // columnGap: 10,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            // style: 'tableExample',
                            table: {
                                headerRows: 1,
                                // heights: ['*', 100, '*'],
                                widths: [231, 222],
                                // dontBreakRows: true,
                                // keepWithHeaderRows: 1,
                                body: [
                                    // [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                                    [
                                        // [{text: 'ที่อยู่ ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        // [{text: 'เงื่อนไขการเสนอราคา ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        {
                                            text: [
                                                {
                                                    text: 'ที่อยู่ ',
                                                    font: 'PSU',
                                                    fontSize: 16,
                                                    bold: true
                                                },
                                                {
                                                    text: `${model.address}`,
                                                    font: 'PSU',
                                                    fontSize: 16
                                                },
                                            ]
                                        },
                                        [
                                            {
                                                text: 'เงื่อนไขการเสนอราคา \t',
                                                font: 'PSU',
                                                fontSize: 16,
                                                bold: true
                                            },
                                            {
                                                text: `กำหนดชำระเงิน \t ${model.payment_due} \t วัน`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                            // { text: 'กำหนดยืนราคา \t ค่า \t วัน', font: 'PSU', fontSize: 16 },
                                            {
                                                text: `กำหนดรับประกัน \t ${model.guarantee} \t ปี`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                        ]


                                    ]
                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: ['*', 100, 100, '*'],
                                widths: [231, 52, 76, 76],
                                body: [
                                    [
                                        {

                                            fillColor: '#EEECE1',
                                            text: 'รายละเอียดสินค้า',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'จำนวน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'ราคาต่อหน่วย',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รวมเงิน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        {
                                            text: `1. ${model.product_detail_1}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(model.product_number_1.toString())}`,
                                            style: 'text_normal',
                                            alignment: 'center',

                                        },
                                        {
                                            text: `${addCommas(product_prize_1)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            text: `${addCommas(total_money_th_1)}`,
                                            style: 'text_normal',
                                            alignment: 'center',

                                        }
                                    ],
                                    [
                                        {
                                            text: `2. ${model.product_detail_2}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(model.product_number_2.toString())}`,
                                            style: 'text_normal',
                                            alignment: 'center',

                                        },
                                        {
                                            text: `${addCommas(product_prize_2)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            text: `${addCommas(total_money_th_2)}`,
                                            style: 'text_normal',
                                            alignment: 'center',

                                        }
                                    ],
                                    [
                                        {
                                            text: `(${thaibath})`,
                                            style: 'text_normal',
                                            colSpan: 3,
                                            alignment: 'left',
                                        },
                                        {},
                                        {},
                                        {
                                            text: `${addCommas(total_money)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        }
                                    ],

                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: [100],
                                widths: [462],
                                body: [
                                    [
                                        [
                                            {
                                                columns: [
                                                    {
                                                        width: '55%',
                                                        text: 'ผู้รับของ \n\n (ลงชื่อ).................................................. \n \u200b \t (..................................................) \n ตำแหน่ง.................................................. \n วันที่..................................................',
                                                        style: 'text_normal',
                                                    },
                                                    {
                                                        width: '*',
                                                        text: [
                                                            {
                                                                text: `ผู้ส่งของ \n\n (ลงชื่อ)........................................ \n \u200b \t \t (${model.forwarder})`,
                                                                style: 'text_normal',
                                                            },
                                                            {
                                                                text: `\n \u200b \t    ${position[0]} `,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                            {
                                                                text: `   ${position[1]} \n \u200b \t   มหาวิทยาลัยสงขลานครินทร์`,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                        ],

                                                    },
                                                ],
                                                columnGap: 0,
                                            },

                                        ]
                                    ],



                                ],

                            },
                        }
                    ],
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    width: 595.3,
                    height: 841.9,
                    // [left, top, right, bottom]
                    // pageMargins: [31.7, 10, 25, 10],
                    pageMargins: [89.85, 19.85, 72, 45.35],
                    styles: {
                        text_normal: {
                            fontSize: 16,
                            font: 'PSU',
                        },
                        text_bole: {
                            fontSize: 16,
                            font: 'PSU',
                            bold: true,
                        }
                    }
                };
            }
            else {
                console.log("1 มีค่า 2 ไม่มีค่า");
                var docDefinition = {
                    content: [
                        {
                            text: 'ใบแจ้งหนี้ \n',
                            font: 'PSU',
                            bold: true,
                            fontSize: 22,
                            alignment: 'center',
                        },
                        {
                            columns: [
                                {
                                    width: '70%',
                                    text: `สำนักนวัตกรรมดิจิทัลและระบบอัจฉริยะ มหาวิทยาลัยสงขลานครินทร์
                                15 ถนนกาญจนวณิชย์ ตำบลหาดใหญ่ อำเภอหาดใหญ่
                                จังหวัดสงขลา 90110 
                                โทร. 0-7428-2102, 0-7428-2073 โทรสาร 074 282 111 
                                อีเมล : naowarat.s@psu.ac.th, orathai.b@psu.ac.th`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 40,
                                //     text: '\u200b',
                                //     font: 'Roboto',

                                // },
                                {
                                    width: '30%',
                                    text: `เลขที่ \t 2/2564 \n วันที่ ${str_date}`,
                                    style: 'text_normal'
                                },
                                // {
                                //     width: 10,
                                //     text: '\u200b',
                                //     font: 'Roboto',
                                // }
                            ],
                            // columnGap: 10,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            // style: 'tableExample',
                            table: {
                                headerRows: 1,
                                // heights: ['*', 100, '*'],
                                widths: [231, 222],
                                // dontBreakRows: true,
                                // keepWithHeaderRows: 1,
                                body: [
                                    // [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                                    [
                                        // [{text: 'ที่อยู่ ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        // [{text: 'เงื่อนไขการเสนอราคา ', font: 'PSU', fontSize: 16}, {text: 'กาเาวนาดนหกาดวนา', font:'PSU', fontSize: 16}],
                                        {
                                            text: [
                                                {
                                                    text: 'ที่อยู่ ',
                                                    font: 'PSU',
                                                    fontSize: 16,
                                                    bold: true
                                                },
                                                {
                                                    text: `${model.address}`,
                                                    font: 'PSU',
                                                    fontSize: 16
                                                },
                                            ]
                                        },
                                        [
                                            {
                                                text: 'เงื่อนไขการเสนอราคา \t',
                                                font: 'PSU',
                                                fontSize: 16,
                                                bold: true
                                            },
                                            {
                                                text: `กำหนดชำระเงิน \t ${model.payment_due} \t วัน`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                            // { text: 'กำหนดยืนราคา \t ค่า \t วัน', font: 'PSU', fontSize: 16 },
                                            {
                                                text: `กำหนดรับประกัน \t ${model.guarantee} \t ปี`,
                                                font: 'PSU',
                                                fontSize: 16
                                            },
                                        ]


                                    ]
                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: ['*', 200, '*'],
                                widths: [231, 52, 76, 76],
                                body: [
                                    [
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รายละเอียดสินค้า',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'จำนวน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'ราคาต่อหน่วย',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            fillColor: '#EEECE1',
                                            text: 'รวมเงิน',
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        {
                                            text: `1. ${model.product_detail_1}`,
                                            style: 'text_normal',
                                        },
                                        {
                                            text: `${addCommas(model.product_number_1.toString())}`,
                                            style: 'text_normal',
                                            alignment: 'center',

                                        },
                                        {
                                            text: `${addCommas(product_prize_1)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        },
                                        {
                                            text: `${addCommas(total_money_th_1)}`,
                                            style: 'text_normal',
                                            alignment: 'center',

                                        }
                                    ],
                                    [
                                        {
                                            text: `(${thaibath})`,
                                            style: 'text_normal',
                                            colSpan: 3,
                                            alignment: 'left',
                                        },
                                        {},
                                        {},
                                        {
                                            text: `${addCommas(total_money)}`,
                                            style: 'text_normal',
                                            alignment: 'center',
                                        }
                                    ],

                                ]
                            }
                        },
                        {
                            text: '\u200b \n',
                        },
                        {
                            table: {
                                heights: [100],
                                widths: [462],
                                body: [
                                    [
                                        [
                                            {
                                                columns: [
                                                    {
                                                        width: '55%',
                                                        text: 'ผู้รับของ \n\n (ลงชื่อ).................................................. \n \u200b \t (..................................................) \n ตำแหน่ง.................................................. \n วันที่..................................................',
                                                        style: 'text_normal',
                                                    },
                                                    {
                                                        width: '*',
                                                        text: [
                                                            {
                                                                text: `ผู้ส่งของ \n\n (ลงชื่อ)........................................ \n \u200b \t \t (${model.forwarder})`,
                                                                style: 'text_normal',
                                                            },
                                                            {
                                                                text: `\n \u200b \t    ${position[0]} `,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                            {
                                                                text: `   ${position[1]} \n \u200b \t   มหาวิทยาลัยสงขลานครินทร์`,
                                                                style: 'text_normal',
                                                                fontSize: 15
                                                            },
                                                        ],

                                                    },
                                                ],
                                                columnGap: 0,
                                            },

                                        ]
                                    ],



                                ],

                            },
                        }
                    ],
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    width: 595.3,
                    height: 841.9,
                    // [left, top, right, bottom]
                    // pageMargins: [31.7, 10, 25, 10],
                    pageMargins: [89.85, 19.85, 72, 45.35],
                    styles: {
                        text_normal: {
                            fontSize: 16,
                            font: 'PSU',
                        },
                        text_bole: {
                            fontSize: 16,
                            font: 'PSU',
                            bold: true,
                        }
                    }
                };

            }

            // console.log(product_prize + ' : ' + total_money);
            // console.log(typeof total_money);
            // console.log(total_money);

            // console.log(thaibath);

            this.alert.notify('สร้างฟอร์มสำเร็จ', 'info');
            this.pdfMake.createPdf(docDefinition).open();

        } catch (err) {
            this.alert.notify(`function generateInvoice : ` + err.Message);

        }

    }

    // สร้างเอกสารแจ้งหนี้
    async generateInvoiceDocs(model: InInvoiceDocument) {
        await this.loadPdfMaker();
        try {
            let position = model.guarantor_position.split(' ');
            // let d_bend = 2.54 / 2.54 * 72;
            // const img_link = "https://1.bp.blogspot.com/-yyZceDUuEWg/XX8yFMWQdzI/AAAAAAADSQ0/h4KCe71MRgoPyyU97XGmwZBDSOd8yanXQCKgBGAsYHg/s640/%25E0%25B8%25A1%25E0%25B8%25AB%25E0%25B8%25B2%25E0%25B8%25A7%25E0%25B8%25B4%25E0%25B8%2597%25E0%25B8%25A2%25E0%25B8%25B2%25E0%25B8%25A5%25E0%25B8%25B1%25E0%25B8%25A2%25E0%25B8%25AA%25E0%25B8%2587%25E0%25B8%2582%25E0%25B8%25A5%25E0%25B8%25B2%25E0%25B8%2599%25E0%25B8%2584%25E0%25B8%25A3%25E0%25B8%25B4%25E0%25B8%2599%25E0%25B8%2597%25E0%25B8%25A3%25E0%25B9%258C.jpg";


            let str_message_end = "จึงเรียนมาเพื่อโปรดดำเนินการ โดยโอนเงินเข้าบัญชี สำนักนวัตกรรมดิจิทัล และระบบอัจฉริยะ 2 เลขที่บัญชี 565-2-45084-7 ธนาคารไทยพาณิชย์ จำกัด (มหาชน) สาขา มหาวิทยาลัยสงขลานครินทร์ และกรุณาส่งสำเนาใบโอนเงินให้สำนักนวัตกรรมดิจิทัลและระบบ อัจฉริยะทราบ เพื่อดำเนินการออกใบเสร็จรับเงินต่อไป จักขอบคุณยิ่ง"
            let date = model.date.split("-");
            let y_eng = parseInt(date[0]);
            let y_th = y_eng + 543;
            let yy = y_th.toString();
            let m = date[1].toString();
            let mm = await this.convertMount(m);
            let dd = date[2].toString();
            // console.log(` ตัวแปรวันที่ : ${model.date} \n ตัวแปรหลังจาก แบ่ง : ${date} , ${date[0]} , ${date[1]} , ${date[2]} \n dd: ${dd} \n mm : ${mm} \n yy : ${yy}`);
            let str_date = dd + ' ' + mm + ' ' + yy + ' ';

            if (model.address == '' || model.address == ' ' || model.address == null) {
                const docDefinition = {
                    content: [
                        {
                            image: await this.img,
                            width: 68.25,
                            height: 112.5,
                            alignment: "center",

                        },
                        {
                            columns: [
                                {
                                    width: 200,
                                    text: `ที่ อว 68011.1/${model.id_doc}`,
                                    font: 'PSU',
                                    fontSize: 16,
                                },
                                {
                                    width: 40,
                                    text: '\u200b',
                                    font: 'Roboto',

                                },
                                {
                                    width: 220,
                                    text: 'สำนักนวัตกรรมดิจิทัลและระบบอัจฉริยะ \n มหาวิทยาลัยสงขลานครินทร์ \n  ต. หาดใหญ่ อ.หาดใหญ่ \n จ. สงขลา 90110',
                                    font: 'PSU',
                                    fontSize: 16,
                                },
                                // {
                                //     width: 10,
                                //     text: '\u200b',
                                //     font: 'Roboto',
                                // }
                            ],
                            columnGap: 10,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            text: `${str_date}`,
                            font: 'PSU',
                            fontSize: 16,
                            margin: [222, 2, 10, 20],
                        },
                        {
                            text: `เรื่อง ${model.title} \n เรียน ${model.title_to}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [50, 2, 5, 1],
                        },
                        // {
                        //     text: `\u200b \t${model.address}`,
                        //     font: 'PSU',
                        //     fontSize: 16,
                        //     // margin: [70, 2, 5, 1],
                        // },
                        {

                            text: `\u200b \t \t \t ${model.message}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [d_bend, 2, 5, 1],

                        },
                        // {

                        //     text: `${str_start}`,
                        //     font: 'PSU',
                        //     fontSize: 16,
                        //     margin: [50, 2, 5, 1],

                        // },
                        // {

                        //     text: `${str_end_u}`,
                        //     font: 'PSU',
                        //     fontSize: 16,
                        //     margin: [100, 2, 5, 1],

                        // },
                        {

                            text: `\u200b \t \t \t ${str_message_end}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [d_bend, 2, 5, 1],

                        },
                        {
                            text: `\n ขอแสดงความนับถือ \n \n \n (${model.guarantor})`,
                            font: 'PSU',
                            fontSize: 16,
                            margin: [222, 2, 10, 2],
                        },
                        {
                            text: `${model.guarantor_position}`,
                            font: 'PSU',
                            fontSize: 16,
                            margin: [89.85, 2, 10, 20],
                            alignment: "center",
                        },
                        {
                            text: `\n\n\nสำนักงานนวิตกรรมดิจิทัลและระบบอัจฉริยะ`,
                            font: "PSU",
                            fontSize: 16,
                            bold: true,
                        },
                        {

                            text: `โทรศัพท์ 0-7428-2102 \n โทรสาร 0-7428-2111 \n อิเมล์ผู้ประสานงาน : preeda.n@psu.ac.th, panida.o@psu.ac.th`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [10, 2, 10, 20],

                        },
                    ],
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    // pageMargins: [31.7, 10, 25, 10],
                    pageMargins: [89.85, 28.35, 70.9, 28.35],

                };
                this.alert.notify('สร้างฟอร์มสำเร็จ', 'info');
                this.pdfMake.createPdf(docDefinition).open();
            }
            else {
                const docDefinition = {
                    content: [
                        {
                            image: await this.img,
                            width: 68.25,
                            height: 112.5,
                            alignment: "center",

                        },
                        {
                            columns: [
                                {
                                    width: 200,
                                    text: `ที่ อว 68011.1/${model.id_doc}`,
                                    font: 'PSU',
                                    fontSize: 16,
                                },
                                {
                                    width: 40,
                                    text: '\u200b',
                                    font: 'Roboto',

                                },
                                {
                                    width: 220,
                                    text: 'สำนักนวัตกรรมดิจิทัลและระบบอัจฉริยะ \n มหาวิทยาลัยสงขลานครินทร์ \n  ต. หาดใหญ่ อ.หาดใหญ่ \n จ. สงขลา 90110',
                                    font: 'PSU',
                                    fontSize: 16,
                                },
                                // {
                                //     width: 10,
                                //     text: '\u200b',
                                //     font: 'Roboto',
                                // }
                            ],
                            columnGap: 10,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            text: `${str_date}`,
                            font: 'PSU',
                            fontSize: 16,
                            margin: [222, 2, 10, 20],
                        },
                        {
                            text: `เรื่อง ${model.title} \n เรียน ${model.title_to}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [50, 2, 5, 1],
                        },
                        {
                            text: `\u200b \t${model.address}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [70, 2, 5, 1],
                        },
                        {

                            text: `\u200b \t \t \t ${model.message}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [d_bend, 2, 5, 1],

                        },
                        // {

                        //     text: `${str_start}`,
                        //     font: 'PSU',
                        //     fontSize: 16,
                        //     margin: [50, 2, 5, 1],

                        // },
                        // {

                        //     text: `${str_end_u}`,
                        //     font: 'PSU',
                        //     fontSize: 16,
                        //     margin: [100, 2, 5, 1],

                        // },
                        {

                            text: `\u200b \t \t \t ${str_message_end}`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [d_bend, 2, 5, 1],

                        },
                        {
                            text: `\n ขอแสดงความนับถือ \n \n \n (${model.guarantor})`,
                            font: 'PSU',
                            fontSize: 16,
                            margin: [222, 2, 10, 2],
                        },
                        {
                            text: `${position[0] + position[1]}`,
                            font: 'PSU',
                            fontSize: 16,
                            margin: [89.85, 2, 10, 20],
                            alignment: "center",
                        },
                        {
                            text: `\n\n\nสำนักงานนวิตกรรมดิจิทัลและระบบอัจฉริยะ`,
                            font: "PSU",
                            fontSize: 16,
                            bold: true,
                        },
                        {

                            text: `โทรศัพท์ 0-7428-2102 \n โทรสาร 0-7428-2111 \n อิเมล์ผู้ประสานงาน : preeda.n@psu.ac.th, panida.o@psu.ac.th`,
                            font: 'PSU',
                            fontSize: 16,
                            // margin: [10, 2, 10, 20],

                        },
                    ],
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    // pageMargins: [31.7, 10, 25, 10],
                    pageMargins: [89.85, 28.35, 70.9, 28.35],

                };
                this.alert.notify('สร้างฟอร์มสำเร็จ', 'info');
                this.pdfMake.createPdf(docDefinition).open();

            }

        } catch (err) {
            this.alert.notify(`function generateInvoiceDocs : ` + err.Message);
        }

    }
    async generateMessageMemos(model: InMessageMemos) {
        await this.loadPdfMaker();
        try {
            let position = model.guarantor_position.split(' ');
            // let d_bend = 2.54 / 2.54 * 72;
            // const img_link = "https://1.bp.blogspot.com/-yyZceDUuEWg/XX8yFMWQdzI/AAAAAAADSQ0/h4KCe71MRgoPyyU97XGmwZBDSOd8yanXQCKgBGAsYHg/s640/%25E0%25B8%25A1%25E0%25B8%25AB%25E0%25B8%25B2%25E0%25B8%25A7%25E0%25B8%25B4%25E0%25B8%2597%25E0%25B8%25A2%25E0%25B8%25B2%25E0%25B8%25A5%25E0%25B8%25B1%25E0%25B8%25A2%25E0%25B8%25AA%25E0%25B8%2587%25E0%25B8%2582%25E0%25B8%25A5%25E0%25B8%25B2%25E0%25B8%2599%25E0%25B8%2584%25E0%25B8%25A3%25E0%25B8%25B4%25E0%25B8%2599%25E0%25B8%2597%25E0%25B8%25A3%25E0%25B9%258C.jpg";


            let str_message_end = "จึงเรียนมาเพื่อโปรดดำเนินการ โดยโอนเงินเข้าบัญชี สำนักนวัตกรรมดิจิทัล และระบบอัจฉริยะ 2 เลขที่บัญชี 565-2-45084-7 ธนาคารไทยพาณิชย์ จำกัด (มหาชน) สาขา มหาวิทยาลัยสงขลานครินทร์ และกรุณาส่งสำเนาใบโอนเงินให้สำนักนวัตกรรมดิจิทัลและระบบ อัจฉริยะทราบ เพื่อดำเนินการออกใบเสร็จรับเงินต่อไป จักขอบคุณยิ่ง"
            let date = model.date.split("-");
            let y_eng = parseInt(date[0]);
            let y_th = y_eng + 543;
            let yy = y_th.toString();
            let m = date[1].toString();
            let mm = await this.convertMount(m);
            let dd = date[2].toString();
            // console.log(` ตัวแปรวันที่ : ${model.date} \n ตัวแปรหลังจาก แบ่ง : ${date} , ${date[0]} , ${date[1]} , ${date[2]} \n dd: ${dd} \n mm : ${mm} \n yy : ${yy}`);
            let str_date = dd + ' ' + mm + ' ' + yy + ' ';
            const docDefinition = {
                content: [
                    {
                        columns: [
                            {
                                image: await this.img,
                                width: 36,
                                height: 57.6,
                            },
                            {
                                width: 200,
                                text: `\nบันทึกข้อความ`,
                                font: 'PSU',
                                bold: true,
                                fontSize: 22,
                            }

                        ],
                        columnGap: 130,

                    },
                    {

                        width: 250,
                        text: [
                            {
                                text: `ส่วนงาน`,
                                font: 'PSU',
                                bold: true,
                                fontSize: 16,
                            },
                            {
                                text: `  สำนักงานนวัตกรรมดิจิทัลและระบบอัจฉริยะ  โทร. 2102`,
                                font: 'PSU',
                                fontSize: 16,
                            }
                        ],
                    },
                    {
                        columns: [
                            {
                                text: [
                                    {
                                        text: `ที่`,
                                        font: `PSU`,
                                        fontSize: 16,
                                        bold: true,
                                    },
                                    {
                                        text: ` มอ 011/${model.id_doc}`,
                                        font: `PSU`,
                                        fontSize: 16,

                                    }
                                ],

                            },
                            {
                                text: `${str_date}`,
                                font: 'PSU',
                                fontSize: 16,
                            }

                        ],
                        columGap: 10,
                    },
                    {
                        text: [
                            {
                                text: `เรื่อง`,
                                font: 'PSU',
                                fontSize: 16,
                                bold: true,
                            },
                            {
                                text: `  ${model.title}`,
                                font: 'PSU',
                                fontSize: 16,
                            }
                        ],
                    },
                    {
                        text: [
                            {
                                text: `เรียน`,
                                font: 'PSU',
                                fontSize: 16,
                                bold: true,
                            },
                            {
                                text: `   ${model.title_to}`,
                                font: 'PSU',
                                fontSize: 16,
                            }
                        ],
                    },
                    {

                        text: `\u200b \t \t \t ${model.message}`,
                        font: 'PSU',
                        fontSize: 16,

                    },
                    {

                        text: `\u200b \t \t \t ${str_message_end}`,
                        font: 'PSU',
                        fontSize: 16,
                    },
                    {
                        text: `\n \n \n (${model.guarantor})`,
                        font: 'PSU',
                        fontSize: 16,
                        margin: [222, 2, 10, 2],
                    },
                    {
                        text: `${position[0]}${position[1]}`,
                        font: 'PSU',
                        fontSize: 16,
                        margin: [89.85, 2, 10, 20],
                        alignment: "center",
                    },
                ],
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [89.85, 28.35, 70.9, 28.35],

            };
            this.alert.notify('สร้างฟอร์มสำเร็จ', 'info');
            this.pdfMake.createPdf(docDefinition).open();

        } catch (err) {
            this.alert.notify(`function generateMessageMemos : ` + err.Message);

        }


    }


    //ทดสอบการสร้างเอกสาร
    async generateTesting() {
        await this.loadPdfMaker();
        try {
            let str_message_end = "จึงเรียนมาเพื่อโปรดดำเนินการ โดยโอนเงินเข้าบัญชี สำนักนวัตกรรมดิจิทัล และระบบอัจฉริยะ 2 เลขที่บัญชี 565-2-45084-7 ธนาคารไทยพาณิชย์ จำกัด (มหาชน) สาขา มหาวิทยาลัยสงขลานครินทร์ และกรุณาส่งสำเนาใบโอนเงินให้สำนักนวัตกรรมดิจิทัลและระบบ อัจฉริยะทราบ เพื่อดำเนินการออกใบเสร็จรับเงินต่อไป จักขอบคุณยิ่ง"

            const docDefinition = {
                content: [
                    {
                        columns: [
                            {
                                image: await this.img,
                                width: 36,
                                height: 57.6,
                            },
                            {
                                width: 200,
                                text: `\nบันทึกข้อความ`,
                                font: 'PSU',
                                bold: true,
                                fontSize: 22,
                            }

                        ],
                        columnGap: 130,

                    },
                    {

                        width: 250,
                        text: [
                            {
                                text: `ส่วนงาน`,
                                font: 'PSU',
                                bold: true,
                                fontSize: 16,
                            },
                            {
                                text: `  สำนักงานนวัตกรรมดิจิทัลและระบบอัจฉริยะ  โทร. 2102`,
                                font: 'PSU',
                                fontSize: 16,
                            }
                        ],
                    },
                    {
                        columns: [
                            {
                                text: [
                                    {
                                        text: `ที่`,
                                        font: `PSU`,
                                        fontSize: 16,
                                        bold: true,
                                    },
                                    {
                                        text: ` มอ 011/{model.id_doc}`,
                                        font: `PSU`,
                                        fontSize: 16,

                                    }
                                ],

                            },
                            {
                                text: `{str_date}`,
                                font: 'PSU',
                                fontSize: 16,
                            }

                        ],
                        columGap: 10,
                    },
                    {
                        text: [
                            {
                                text: `เรื่อง`,
                                font: 'PSU',
                                fontSize: 16,
                                bold: true,
                            },
                            {
                                text: `  {model.title}`,
                                font: 'PSU',
                                fontSize: 16,
                            }
                        ],
                    },
                    {
                        text: [
                            {
                                text: `เรียน`,
                                font: 'PSU',
                                fontSize: 16,
                                bold: true,
                            },
                            {
                                text: `   {model.title_to}`,
                                font: 'PSU',
                                fontSize: 16,
                            }
                        ],
                    },
                    {

                        text: `\u200b \t \t \t {model.message}`,
                        font: 'PSU',
                        fontSize: 16,

                    },
                    {

                        text: `\u200b \t \t \t ${str_message_end}`,
                        font: 'PSU',
                        fontSize: 16,
                    },
                    {
                        text: `\n \n \n ({model.guarantor})`,
                        font: 'PSU',
                        fontSize: 16,
                        margin: [222, 2, 10, 2],
                    },
                    {
                        text: `{model.guarantor_position}`,
                        font: 'PSU',
                        fontSize: 16,
                        margin: [89.85, 2, 10, 20],
                        alignment: "center",
                    },
                ],
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [89.85, 28.35, 70.9, 28.35],

            };
            this.alert.notify('สร้างฟอร์มสำเร็จ', 'info');

            this.pdfMake.createPdf(docDefinition).open();

        } catch (err) {
            this.alert.notify(`function generateTesting : ` + err.Message);
        }

    }
}

// ฟังก์ชั่นแปลงตัวเลขเป็นคำอ่านภาษาไทย
// "use strict";

function ThaiNumberToText(Number) {
    Number = Number.replace(/๐/gi, '0');
    Number = Number.replace(/๑/gi, '1');
    Number = Number.replace(/๒/gi, '2');
    Number = Number.replace(/๓/gi, '3');
    Number = Number.replace(/๔/gi, '4');
    Number = Number.replace(/๕/gi, '5');
    Number = Number.replace(/๖/gi, '6');
    Number = Number.replace(/๗/gi, '7');
    Number = Number.replace(/๘/gi, '8');
    Number = Number.replace(/๙/gi, '9');
    return ArabicNumberToText(Number);
}

function ArabicNumberToText(Number) {
    var Number = CheckNumber(Number);
    var NumberArray = new Array("ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ");
    var DigitArray = new Array("", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน");
    var BahtText = "";
    if (isNaN(Number)) {
        return "ข้อมูลนำเข้าไม่ถูกต้อง";
    } else {
        if ((Number - 0) > 9999999.9999) {
            return "ข้อมูลนำเข้าเกินขอบเขตที่ตั้งไว้";
        } else {
            Number = Number.split(".");
            if (Number[1].length > 0) {
                Number[1] = Number[1].substring(0, 2);
            }
            var NumberLen = Number[0].length - 0;
            for (var i = 0; i < NumberLen; i++) {
                var tmp = Number[0].substring(i, i + 1) - 0;
                if (tmp != 0) {
                    if ((i == (NumberLen - 1)) && (tmp == 1)) {
                        BahtText += "เอ็ด";
                    } else
                        if ((i == (NumberLen - 2)) && (tmp == 2)) {
                            BahtText += "ยี่";
                        } else
                            if ((i == (NumberLen - 2)) && (tmp == 1)) {
                                BahtText += "";
                            } else {
                                BahtText += NumberArray[tmp];
                            }
                    BahtText += DigitArray[NumberLen - i - 1];
                }
            }
            BahtText += "บาท";
            if ((Number[1] == "0") || (Number[1] == "00")) {
                BahtText += "ถ้วน";
            } else {
                let DecimalLen = Number[1].length - 0;
                for (var i = 0; i < DecimalLen; i++) {
                    var tmp = Number[1].substring(i, i + 1) - 0;
                    if (tmp != 0) {
                        if ((i == (DecimalLen - 1)) && (tmp == 1)) {
                            BahtText += "เอ็ด";
                        } else
                            if ((i == (DecimalLen - 2)) && (tmp == 2)) {
                                BahtText += "ยี่";
                            } else
                                if ((i == (DecimalLen - 2)) && (tmp == 1)) {
                                    BahtText += "";
                                } else {
                                    BahtText += NumberArray[tmp];
                                }
                        BahtText += DigitArray[DecimalLen - i - 1];
                    }
                }
                BahtText += "สตางค์";
            }
            return BahtText;
        }
    }
}

//แปลงรูปภาพจาก URL เป็น base64
function getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");

        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            // console.log(dataURL);

            resolve(dataURL);
        };

        img.onerror = error => {
            reject(error);
        };

        img.src = url;
    });


}

function CheckNumber(Number) {
    var decimal = false;
    Number = Number.toString();
    Number = Number.replace(/ |,|บาท|฿/gi, '');
    for (var i = 0; i < Number.length; i++) {
        if (Number[i] == '.') {
            decimal = true;
        }
    }
    if (decimal == false) {
        Number = Number + '.00';
    }
    return Number
}

function addCommas(number_string) {

    number_string += '';

    let x = number_string.split('.');

    let x1 = x[0];

    let x2 = x.length > 1 ? '.' + x[1] : '';

    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {

        x1 = x1.replace(rgx, '$1' + ',' + '$2');

    }
    let result = x1 + x2;

    return result;

}
