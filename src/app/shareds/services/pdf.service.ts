import { Injectable } from "@angular/core";
import pdfMake from 'pdfmake-thai/build/pdfmake';
import pdfFonts from 'pdfmake-thai/build/vfs_fonts';
import { InDelivery } from "src/app/authentication/financial-document/components/delivery/delivery.interface";
import { InInvoiceDocument } from "src/app/authentication/financial-document/components/invoice-document/invoice-document.interface";
import { InInvoice } from "src/app/authentication/financial-document/components/invoice/invoice.interface";
import { AlertService } from "./alert.service";
import * as imageToBase64 from 'image-to-base64'
import { HttpClient } from "@angular/common/http";
import { InMessageMemos } from "src/app/authentication/financial-document/components/message-memos/message-memos.interface";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// declare var require: any

@Injectable({
    providedIn: 'root',
})

export class PdfService {
    pdfMake: any;
    private img2 = 'data:image/jpeg;base64,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';
    private img3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAC3CAMAAAAfDzEMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURf///+/39wAAAO/v762tpVJKUt7m3t7W3tbO1oyEjGtzc6WcnM7FzpScnK21tUpKQpSUjFJaWmNrY2NaWoR7hL3FxSkhKb21tTo6QhkhIXt7ezo6OgAICBAZEIycY4RaOoRaEBAQUhBCUmuUvVoQUloQGTExMRAICGvF3mPOWhCMWmOUEGvFnGPOGRCMGWMQjBAZzhAZhObee+beMebvrbXee7XeMRCt3hCtnBDv3hDvnObOrRDO3hDOnLXm1mNalOalEOZCELWlELVCEOZzEOYQELVzELUQEIxa72Na74xaxWNaxTpazmuU74wQUjpahIwQGRBCGRBazhBahDEQUuZStTFaGeYZtRBjUrVStbUZtYyUvVoxUloxGVJaGeZSlOYZlLVSlLUZlOZC5uYI5rVC5rUI5ozv3ozvWkLv3jrvWkKt3jqtWkKtnIyUMYzvnIzvGTqtGULvnIwxjDrvGToZ7zoZpYzF3mPvWhCtWmOUMYzFnGPvGRCtGWMxjBAZ7xAZpRDvWhDvGULO3jrOWkLOnDrOGRDOWhDOGWuclIRaWualc+ZCc+alMeZCMbWlMbVCMbWlc7VCc7XvpeZzMeYQMbVzMbUQMeZzc+YQc7Vzc7UQc+alUuZCUrWlUrVCUrXOpeZzUuYQUrVzUrUQUjpa74yU74wxUjpape+tpYwxGWOlYxBjGRBa7xBape+Epa2Epc6tpWOEY86EpTpaUuZj5uYp5rVj5rUp5uat74xanDEQCLWt7+aE77WE7+bvWubvELXvWrXvEBCM7xCMrbXe9+atzoxae7WtzuaEzrWEzubOWubOELXOWrXOEBCMzhCMjIwp72Mp74wpxWMpxWvv74zOa0KM7zqMa0KMrYylEGvvrYzOKTqMKYwQnDopzjophIwI72MI74wIxWMIxWvvzozOSkKMzjqMSkKMjIyEEGvvjIzOCDqMCIwQezoIzjoIhNbe9zE6EFJjQox7WhAIKWNac2t7lO/O3jo6Wvfv3u/W962ctf/e9///7wAAAOoaXN8AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAAsTAAALEwEAmpwYAAAaG0lEQVR4Xu1cW3PjKpdFAhvhgBFYMgZZr/j/T/VbflXGlVTipFyzNpITp+/Tnc7UVH27TvexFVtb+74WkGb/kf/I90XYmPj8+hMlfGmDVfObTxS3gslJzu8+TzbQax5O87vPE75Y+GzmN58p3rnN/0FeMadC0vPrz5TBMCfm158p9obt/g/qSHvNbJrffKJ0MTBrl/O7TxNpvbLp8wspea4cV/6zG1ZWTBm2/PSMtmrpt4J/uqNNXATt4+qzO5Yfs2a+tp/bscTCNWodjExWfWZmuXrDuB9vmNnXn5lZKN4k/MGo1Lp+vvYZYlWltkZaJ59XYb72GbIzTCjOOsMq+5mVhBloEFcDnbabr32G5BvGnbjbQPenYkrnGbvbHMWZiS+fGV9pN4FrzRsVb+ZLnyLarLZHl30EyJovfYaEnF3tdlt/GGz8vHyWNqmD36Ruk6ITyO3PERVTpb2USy65a5mx+VN8rYfaMA8jjToz2Upp608pYZu0E+6GhUStShllxG49/+wfitoH5m4Piq2EdEEPEbjymP/9MHRjY5T+MmbDmXDQasyji/98/KuDVdGt06HeCKNibUUbfToc/7XBTbTrEHQfRK+DDkLrEPqHfTv/+N9JAISszgTneMWq8je3Hi/+tdiYvLPO75y3i7SzDyuL1Pr3YpOUoQtyg3xSoCt450jvvzTZQAFBdSk4U4KlNXN4xxeG6fAv9YrcPgAyp9hxIGjyr4/HngHN5n9KSU08kNrkwMfsQ58F84PCKPZj/U/1WtVbkxSvVMJEAPe2q4b1/sWn8PSvcDRKxznONDAs3liHucDEjjKqId7fwun/JMRp62xgXGe3yltrN9a5wTmL1yp6fmYuI7fnz36k2Hocty6Z0De91ss7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';
    constructor(
        private alert: AlertService,
        private http: HttpClient,
    ) { }

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
            let total_money_th = ((parseFloat(`${model.product_number_1}`) * parseFloat(`${model.product_prize_1}`)) + (parseFloat(`${model.product_number_2}`) * parseFloat(`${model.product_prize_2}`)) ).toFixed(2);
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
    }

    // สร้างใบแจ้งหนี้
    async generateInvoice(model: InInvoice) {
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
            let total_money_th = ((parseFloat(`${model.product_number_1}`) * parseFloat(`${model.product_prize_1}`)) + (parseFloat(`${model.product_number_2}`) * parseFloat(`${model.product_prize_2}`)) ).toFixed(2);
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
    }

    // สร้างเอกสารแจ้งหนี้
    async generateInvoiceDocs(model: InInvoiceDocument) {
        await this.loadPdfMaker();
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
                        image: this.img3,
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
                        image: this.img3,
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
        // let cs = 60;
        // let ce = 60;
        // let check = 0;
        // let message_start_length = model.message_start.length;
        // let message_end_length = model.message_end.length;

        // while (true) {
        //     cs++;
        //     // console.log('this is message_start {cs}' + message_start_length);
        //     // console.log(cs);
        //     // console.log(model.message_start[cs]);
        //     if (cs >= message_start_length) {
        //         check = 1;
        //     }
        //     if (model.message_start[cs] == ' ' || model.message_start[cs] == '' || model.message_start[cs] == null && cs >= message_start_length) {
        //         break;
        //     }
        // }
        // while (true) {
        //     ce++;
        //     // console.log('this is message_end {ce}' + message_end_length);
        //     // console.log(ce);
        //     // console.log(model.message_end[ce]);
        //     if (ce >= message_end_length) {
        //         check = 1;
        //     }
        //     if (model.message_end[ce] == ' ' || model.message_end[ce] == '' || model.message_end[ce] == null && ce >= message_end_length) {
        //         break;

        //     }
        // }

        // if (check == 1) {
        //     this.alert.notify('ไม่สามารถสร้างฟอร์มได้');
        //     return;
        // }
        // let str_start_u = model.message_start.substring(0, cs);
        // let str_start = model.message_start.substring(cs, message_start_length);
        // let str_end_u = model.message_end.substring(0, ce);
        // let str_end = model.message_end.substring(ce, message_end_length);


    }
    async generateMessageMemos(model: InMessageMemos) {
        await this.loadPdfMaker();
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
                            image: this.img3,
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

    }


    //ทดสอบการสร้างเอกสาร
    async generateTesting() {
        await this.loadPdfMaker();
        // let position = model.guarantor_position.split(' ');
        // let d_bend = 2.54 / 2.54 * 72;
        // const img_link = "https://1.bp.blogspot.com/-yyZceDUuEWg/XX8yFMWQdzI/AAAAAAADSQ0/h4KCe71MRgoPyyU97XGmwZBDSOd8yanXQCKgBGAsYHg/s640/%25E0%25B8%25A1%25E0%25B8%25AB%25E0%25B8%25B2%25E0%25B8%25A7%25E0%25B8%25B4%25E0%25B8%2597%25E0%25B8%25A2%25E0%25B8%25B2%25E0%25B8%25A5%25E0%25B8%25B1%25E0%25B8%25A2%25E0%25B8%25AA%25E0%25B8%2587%25E0%25B8%2582%25E0%25B8%25A5%25E0%25B8%25B2%25E0%25B8%2599%25E0%25B8%2584%25E0%25B8%25A3%25E0%25B8%25B4%25E0%25B8%2599%25E0%25B8%2597%25E0%25B8%25A3%25E0%25B9%258C.jpg";


        let str_message_end = "จึงเรียนมาเพื่อโปรดดำเนินการ โดยโอนเงินเข้าบัญชี สำนักนวัตกรรมดิจิทัล และระบบอัจฉริยะ 2 เลขที่บัญชี 565-2-45084-7 ธนาคารไทยพาณิชย์ จำกัด (มหาชน) สาขา มหาวิทยาลัยสงขลานครินทร์ และกรุณาส่งสำเนาใบโอนเงินให้สำนักนวัตกรรมดิจิทัลและระบบ อัจฉริยะทราบ เพื่อดำเนินการออกใบเสร็จรับเงินต่อไป จักขอบคุณยิ่ง"
        // let date = model.date.split("-");
        // let y_eng = parseInt(date[0]);
        // let y_th = y_eng + 543;
        // let yy = y_th.toString();
        // let m = date[1].toString();
        // let mm = await this.convertMount(m);
        // let dd = date[2].toString();
        // console.log(` ตัวแปรวันที่ : ${model.date} \n ตัวแปรหลังจาก แบ่ง : ${date} , ${date[0]} , ${date[1]} , ${date[2]} \n dd: ${dd} \n mm : ${mm} \n yy : ${yy}`);
        // let str_date = dd + ' ' + mm + ' ' + yy + ' ';
        const docDefinition = {
            content: [
                {
                    columns: [
                        {
                            image: this.img3,
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

        this.pdfMake.createPdf(docDefinition).open();


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
// function getBase64ImageFromURL(url) {
//     return new Promise((resolve, reject) => {
//         var img = new Image();
//         img.setAttribute("crossOrigin", "anonymous");

//         img.onload = () => {
//             var canvas = document.createElement("canvas");
//             canvas.width = img.width;
//             canvas.height = img.height;

//             var ctx = canvas.getContext("2d");
//             ctx.drawImage(img, 0, 0);

//             var dataURL = canvas.toDataURL("image/png");
//             // console.log(dataURL);

//             resolve(dataURL);
//         };

//         img.onerror = error => {
//             reject(error);
//         };

//         img.src = url;
//     });


// }

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
