/*
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const Fragments = PDFServicesSdk.Fragments;
/**
 * This sample illustrates how to merge the Word based document template with the input JSON data and Fragments JSON to generate
 * the output document in the docx format.
 * The document template used in the sample covers the use of various document generation template tags.
 * <p>
 * To know more about document generation and document templates, please see the <a href="http://www.adobe.com/go/dcdocgen_overview_doc">documentation</a>
 * And to know more about fragments use-case in document generation and document templates, please see the <a href="http://www.adobe.com/go/dcdocgen_fragments_support">documentation</a>
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
try {
    // Initial setup, create credentials instance.
    const credentials =  PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile("pdfservices-api-credentials.json")
        .build();

    // Setup input data for the document merge process
    const jsonString= "{\n" +
        "\t\"customerName\": \"Kane Miller\",\n" +
        "\t\"customerVisits\": 100,\n" +
        "\t\"itemsBought\": [{\n" +
        "\t\t\t\"description\": \"Sprays\",\n" +
        "\t\t\t\"quantity\": 50,\n" +
        "\t\t\t\"amount\": 100\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"description\": \"Chemicals\",\n" +
        "\t\t\t\"quantity\": 100,\n" +
        "\t\t\t\"amount\": 200\n" +
        "\t\t}\n" +
        "\t],\n" +
        "\t\"totalAmount\": 300,\n" +
        "\t\"previousBalance\": 50,\n" +
        "\t\"lastThreeBillings\": [\n" +
        "\t\t100, 200, 300\n" +
        "\t],\n" +
        "\t\"photograph\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAZuElEQVR4nL1de7gcRZX/neqeme65l7zuzRsijxgwBJJAghBBXQ0PkeCCD15+i+7qqkvg81v8dkX9Y1fYBZUVBVzQRR4rEXCVh8AniisQFJIQlIsIeQAxkoQ8bp7ce+fR3XX2j+ruqZ7q7um5N+z55ruZ6T516lTVr845daq6Q+sO6Z0B8hkABBRJAAKEiNR1otYVnYi178QxJzOn8kecLR7mlmROryTklIkrFPNLg1+ivXbFybJVu8/t5fRSUteEBTPb2c0ZDYWNBwBktDrilIozj1dJyxqk0emm6pJSdlbRoNTOEgCYJSJFVf8LDSl6A3QsEAtEnZWHq0hPzugIHZVBAqEC8fgXwFQCp7KFZR01IeI4E1OhTErvrM6UNeaqmiIDZnLmT9uwFLe6KUurbvFSnBKdpY+SoBZGLLTbi5DHwFpxPbO6SRo8um3qgCYTL6GFAoAgi8fEFIvWFQ2nhZAlC9iOIrgwKV+m5M7WLwtNSQuVz1OUbAlIlkwCSb8W2iklVEOZ8pIEibQR1kkYV1L41TBoJRJeTLOYJmWhKQKMEt/ZQoXSNEyZnlTVYkc6K6U7T6MQZTiYfipCUFGLk4+mIq3oVrLS0A7vMRD1qB5hpdipcNhaWAMCAMQW2rykroReMQKAAUu7RqEK1AlHITvQ5um4ZTFVWCA1G6exZFsohURtcun8SqsUm9V9dNNqttRNvi5TZ6f2CSoJlA2pfB+noym0TflyRlWLIlsyJEj1IoW9C0ThYujjDFuWQmObkRxHZ6ZNMa2S+m7G4ubELBhDtZU1MKXsaQdvGFbDLbXePtKj/w76hJTn6dL4M+5mWCiTbA6LCCRnrI4mHWs66bgrHogmFE2Ia69RJx1HqmhW3GTKL44maaxAiSwAAUu0Iatba6XjLj+MGB1l4YhbFzqWyrhbGE36dRvguKgyk+FSnDQzZpCJu+Kk6kuWagWQuvFR+vi5gUXCKum2dQxoSkZ8yQie41W4kqC7/4zF81iIBTh2JmEjBQCQjFuQ8Gu51RaJwrtFUxbZyg1JY5yFZABCUPIy9CFMdF8GBtXQJ5qkDWKIZTCAgLVqzA4SLTmZ8XcooBU3dYumrPg+aAWl2WRGLln4yhphM55m3e6oK5G7zdNEzc8CUMgKOyI53cVi+hVbqmGhsMNbQjM1b/GIDH6h1RiQYfpTJOuFCQAFzIBMmMbW1y5wpIkfHZp0siVYMksQkgudIpTVodkd3ZmYGYxApacL8seUpc8Y0KSTDSLi5MhopCadUDPASsF0jhIQxgRUoQmDWME5DlaAphc0PQJIWHArACi108eEo1AtpHk6RSaaImkEwI48eXp7VWN8AqJJp7v8fCQqDxuuVamlm7pK0U8CvKGR5oyZlaWn+7YVrHmWXnrZKZdQLptqHTQcmSFIhzhLdRYITNKwLMLQSndWoaAC9tYsldCTqDk0zB8+e8attwbDw1QqO4fN3P397x+46quu14Bdaa+lSxyp+FtJyOqmfDTpBcwMXSZJGo0xyi1F3Gj4c+bMXHH3nltueXPe8VuPnTv4n7dMXX7F+O/dWPd8BEHHMEoy50BJ3VWkX2eNisuktb3VaUzSWOWl8Y5hSaNltaOuYwDe8HDv9ddXTlmy7T1Lespl9rza+HEzXxzoOewdr59zjnj0UdHToxcLLU1xHBlk4ii5ojQGVqggWe2l6sWYmTkAB4muT0pn0d1Hk6zLlwwOZNO2y6ed+taDD5QBWSrDdXnf/sbq1QDG/82lTSKKalejPToc6Trkl027LmW0F2uHDsqYz4n+jtKI4a+uKEyVpV2W0ho3zu7rq73yigCIwAQCeNcggOopp+yePDnYu5fLpbYqWRvjZJRkRPbQ72qkWTo1oqHLMfMWsVPqymYdfGLJPb2WZYv9e1kgYBkOrhAAKtOniVmzpO9lDU6+3RkdjvLL2pIgo3shCLrcASxCeiQeg5iZJYEIDBmwCmAoIGDiJADCtoMpky0GgzhaNSUQVMSvaTMmsnftPs5Ek2kNFY+tROj7w9H+zcEk1v4N8+UALEGNOnvNwO1VoR6xlLZNU6cpbulUPCjFOHOdXngfO4qXulvb6ndtADKKpFnv744qjIKIwaQsDhGRgDc0Uq/VacpUZjAJyMAaP945dEbIX28yYBlBc6YlCmsBWsGkiC8lwmNdgmaVdGJ9YyWZdRBqgVGozaMmtmLISmYBksPDvHNnz+yjDgDELJtNmja9PGOm0k8cOACAwdQeu+fnJwqEyoV59CyL2pFWmyusT778VB8l51U3ammJCsEW2Nu40Tl27m7AAktm65hjbNdlwB8Z4cE9JASzsVQwfLdMxEd59qgIjnSdA80oZXpDziUVK5kRmUlZ8lWLBXBgzVr7mGOk45LHPtC7YIFSztuxg3fthG2ZGyVRB3WOvPS2FOHJ4lS1COYwKzI66soPSG1IA4ZkImHVV68qTeq3Z8+WzYYnqLToRMVQ27ypsX+vEJbagGUCEyQo/gAi/qi7EARBESfLqAdkVHX84VCgYBKRtJaG4YcgIzlKcnTWYZSnYFTZ7jhlNMEZTOWyt3Fjc8dO5wN/1Xjpj/b0GT0LFkhAAP4r6+AHfrkMZuUakO3LFHWfTc1j1QGrJKsxERJgo/sP+iesWI0VAQJsk+V5Q0/8euKyc2qAvWChO3Wa6o+hgQEbiLBDBEERgvRPAkEMySn1KgQlcSRUmq7FE/YAx5+4W9XMZN1mvS2xQjZJZilZSraI9t5/f+/8+d6kvt4lS6C8su/VXhjIyfcXsInd8Zu2z+S3wQhYBlpfjSWC17MCsbz2L5z4KcpObfXaxhtbxn/+c87Ji9XFkdc3ees3OKUyU0saRW4wP8DJ8mspZwr1VYGRiTdP6aTs7owlgo+iZJ2EdkerRWVfGWwJq+HtvOPO2dddG5+1Hl6zWu7fJ10XcdZBk9VBhwL76mGyUOPMB6m6KwKQ1NxK6FGSV4p/9LKRmWAm1v1U6LnCLmAJtuzSvnvvbQzuKvceojpl/1NPWYAkarN3ynYwsSaqZYmiDyQQMAexH9T8mqlDOD91UwjiSFrACDiU8P+UdVBZoYTtUB8FOUsEe3c33tiqtPGHR0Z+94ww9jugmg1VlJkFsyhiuXR7pGuSxZ9l42wJSHQItDpurKYnurTf+VYmaDbKJ54w8aTFAASw97lVjY0beyqODI2nFpFr2wdZJz/T7GbripF0CC8l1psZMzjlaLcJtvyhSxwIz+HLJo/R/+FlVC6rn3sefdTy/aBc0dONRU5aSG1zv4glUsRaTiKfws7SGzyWxXR8tIPT4Bb5qYQbEL4vXXfiR5bFbD3z5g8CtpQs2tf9YRkijgLFrE5J4ChxgxC5l3wchQkrjfNtsVlxjqxlmBNEzBT/aDbq5XefNG7BQsX51muvTjz77N4Pn+3Xa6knFSRzwDKIZEsppUxaw3zdCnNK5nC7PuK0JViC2DgUOzpKaNBa5EdJFRUlaXk8AWoAMz/+MSKhVjlbrv+2cKtHfve7Lzz5pNtscqkUCSDo9ijNypqRkWLSo8h8HOmcMpwG+jMAUfVjpHQVjMa0pVLY86h/ct+yc1X5oF4ffvKJHTfegEDO/Po1Nc+L2XUEmZLN3cludSuSvbCjgGLMqx2tpgxDEWfOW2a44TXGnXVmz2Gz1Mpr8Kkn6xs3OIFc/7m/X/j444MPPdhcubJUdWPZnDCHRl5XMiIrk48gTmRTAUCacytcLejz4G0gPdMUWpnWcldBRAJAIKUQ0y65OC646yf3WYG0HGf4yac233jT3LtXNMeN40ZTNU9SSq5RR1CRPXPTEmWRiUr6VU+1nzM9YL4D7vZgW9t1rtd44fwTn1ltVSoAatvf/MPChaXBXShXyPOHiBauWT28fsPGCy7ocSqSLGrzYkUoBUGqbm2HXGtj1gxTSOyArBYKUu+GiQMpI7yYvinLdhBQZ/RfdLFVqagbux54INi+g0plALJcdprNly64aOpHlk39xy8O1xtU2PokNeyMoPx9bEXqri2ZmSk/gjelmPGL6YiyxREA9po0pX/qhRcp+VLy4I/vsQFmYoYkSW5Vrl83cOElJzxw/9Ar62u/+EUlNF7tnQ6KghVDT2miwbBEegNSzt9rO4kHzWaFi9UCVoOZwdz0/fEfOa/n0MMkIIj2Pb1yaNUqqpSDSAKDy45z4MEHXvnKVQvv/5k1f2FzpEbG9iEzcyBZSg4CkpKkWmXn1d4RoVk8cVq525RM+9xUT0fLlteLruseKrwE8n3PqRz22c8iguTW22+H76PkRiwAAEFupbLt2uvcmTMWPfG/q5ac7K3bICzhB5KjDIQfukdiSz2dKNVRCAJKANk2l0vp6bVOONJXIKzvG3ZtDjhlBYm2bqLWwqKNmp437kPnTFi8WOk09OrGfT9/qBzFnwACAgBLMktZAdYtvyLwggWPPPzC+R+nPXuq8461Dz9i/KxZ9rSplQnj0dOLag+VSpDMDQ8jBxqDu0c2bNj9/HP1tc97g7srgOW6KUGsHu6Yz3tLGbdI3bMDIADJrN3xTCq6QDXLCZY+0czlywEELC0Sm2+5hfcfQLXKYJJg3w98rwkwUJo0oTzn6BnzjhOuM+6oOacODNS2bmvueFPWm3LHtpGdOw+89HJ9356g3giCgCBKlXKlb1Ll0MP6zzn3nV//en3Pnjd/8tMtP7ilNvBixXHiY666bjqOklZPxDfCLnu06k5mEYxp+VyU1KHbYLjmfOCDJzz+OBERYfiNN55bdGJ51yAzB0ADKE/ury6YP+G0949fcnLPUUfZlfLIzsHaKy8PPvFE9bjjjlx++XOf+vT2u+50AQFY0U56DAxWyT/AWbTo+B/eNun4+c2hAy9f9dUdN99cccokLKR1VtrQtg5+KwqnoV5Tt9YrZebr3zmMusMbgWwQ5nzpS5YgVdfmb36ztnOXLNmVuXOnLD190ukf7D12HoQY2bDxwOpVm2+6sTkwUNv6JnueDWwHan96edHNN22a+67XvnKVFciS63L0eKiMdsqIGeD62rUvXHzxac88Wx43bsFNN63+y+a3fv6wVXWRtERm1+iRl34yJ0SWz0FmZ5DWer1TO3eWSpK0bgsmv1ZzT//A4l/9Wsna/+prA5cvn/n+9/WdfXZl6rTa1q37n16561ePjzz/+8b2Ny11QFgIYdssBIiIuVavV087df5dd/p79v9p+WVDq1a5gHBdicTimojID0Ykn7Rm1aSFJwDY9tCDA+edXymXOPKp5l6BtiwLF3D6jLN9wCcOou2DNmjF6ywFA62LCsQcFAChKyAigDnwmkRH/9OXAQokW4J6Dj/8xFtvHXr1tTduv2vvLx+rb1hHgbQBy7KrjsMU1sxxM4icarX+9G+fOeHE2d+4bvEvH9ty332brr2uuWlTBbDLJRaCo/yE9Jro63OmTAmbeugsaZUgAUvolihsadg/ebbY2N3JmITdPicHAOGLbhgA+0HQrA8Dky+6cMrS0yVAgoY2vb7uX/51aOXTjT9vEkCJyKmUUA6fuGbtb0skM4Nt17HeGlr/uS9s+9GP5lx9zanPPbf9kUe23H770KpnZb2h9ksCoAkc/c9fdmceqgDQWL9B+k1UnHY1C2RKFQ89VHWnQKScmcsqpn/XY5Y0CQRC0Gw2/YBwyNLTp19yyfSPnl/pPUTdXXP++XseeMAVFlXKOYOhS46yYwAIzH6t7gHjz1h6+GWXTzplSWP3rr0rVw6uWVvbvbd32uQZHz1v2tIzVIn63t2rz/hQ/fnnyalkaZtKUawvANCDrjsZ5HMyLOUMm9/Gld1CAtj3m57HbrX/gk8cvvwye1K/1dvrTu4HMxG9+egjA+cs66lUWAjtKTvdQCZfGwWQir84PC+sbDEke82GBzhHHjHprLOmLT29+q53VQ+dUe4dB8BvevVdu/b8duX6b37D+/0LZcfJts0AUiKvRGfd7zpTIIIOMMyS3Qpz9SiVgqDZaAY91amXfurIK66wqtXNt/3XG4/+YvG9KybMnkOANzz8zJL3BC8OWK6ru8r4b5xrb3UW6/GQXhkYJKSUzYbPHADkuvbkvtKEPqtS8ev1xo7tzZ07S4DtODmN1DtFJz3/Nab3Z6lnUgENDdHU6PvkJ4/+2tdEpfz6Td/b/sPbhvfvX/iDH0yaPUcyE9Gr375++MWBHrfCGjrDc61qoRsePGtZk+iFTO3IUHyBIDiOBdjM7Pvyja2Nv2wJV7+W5VYqbK4qYzAX2LsOdfhZ1ZkMUegpnPwNbkD4wYjnVRedOPeGG3rnHP3ad76z9Zabse8tBsYtO/eUnz9EzCDaOzDw7GnvcWp1lEqRTB1P7WObeD9XIvcEhCFVFyF1FoKiCoC2/Jd2M3Nt2N0T0UT+SK1hW0ddc/VRX7xiy09++vsLLwy2bnNKgi3yJvTN/Y9vMUBE0vP+ePnl4q1hdircSg+ko8YkE3FFvFjxFuUnv2wCGCksHZTQvhO4OVLHO2adfO99lSmTV5133v7Hf+MCtltBIIcD77hvfWPCO+eoIq/8+9X7n3666rh6+Bdu/STeWgXEqBmVOY2eRjTPVFH8R4/js7CZWO5IRoC0dGKnSRdmRoBmvVFeuOCUxx7b9btn1px1prX/QI/jqDPc9aY3/dJLj/j03yrntf03v3793651SyVOej3zxF4R1EQs7YnvLvauFX/nWqIUjQybXHTStXqaQIygXisfd/x7n3zy1dt+uP7KK3uEIJU8gNUcGa4cP//4G25QOg39ZfMf/u4zJc+H43KHd+ykUDK7JBEupDjKDbTrrz+Lk2WDoMkMKXzGX9XC2m3CWLwhA/D9Zm/vyff/z6Yf37vuyit77BJsW7IkkF8b9vv7F6+4uzJxIgC/NrLmU5fKP28uuZUgdYM0pyI1TTRfGS+cU8dYLd3IeMa/CMlEB7XrYDMQUKZp5WiPPx7YGBEE1H3viC9+GYF86fLlVcuStqXqkfVaw3VPuvtHffPmBYBgXvvZz7z1xFOu47RNbh0vUY0xamCiJuEZjaUv6zYuf6qYCEK7KilP36tsc370n278JLNlTT//r1+79fsl3yfHZTAR/Fq9UXUXrlgx48yz1I78msv+YceKe3oqlUAzVSZeIlsTo6YDScMnFvff+QjKorEEpcxEolRp1ms+4LCUQVD3fTFj+rvvuGPGGWcywI3G2s9/Ycudd/SUS9FOfNSiDLxEjyemoKaF7qSkVlntcpTObkVVxRGki9etXhe7O22bgJLAvr/tofvnXfUVmnXY7kZjuGT3XXTR+57+3YwzzgQw9OdNK89dtvXOO3oqDkTnigIKzQ3S9rRV8rNI8KnvMOkndrLakinHeIKDVjiVvryzDtnPqwDC92tle9E99/S/9737XnrpkFnv6J01C4BXq23677s2XH2Nv3WrW3ElEYWJwERxpMG+SHeEY669ncYMIEzqkFkx/KZOId5H3VkAiCCbXgM89YJPHHr+x0rTpnq7B/eseW77ww8Pv/iiQyDXVU+hs3G0LMvKyLbMQ5bq8aqS0yWZkVd+Z+Uv+MLOutup9Cde4pDClCkirCfwGs1mFCBaQAmwnIoEMXG3acMs1IQ15ofKyllldbeeAc5FUPSj3dKFycysELHYokdYjtPDDGYQsXbqbBQJ1sTRj05dE39X74iJDn2kq93t27LMgbGZIJmDsbxIjAAgIGoLo9WyQN9kjXIGAUCJJ2Ey/JSJqUyLpiRoz0FlnbdJyWFob/PWaze3hw/y++B1ksZkiKIbyrFLozgq0yormRG92yfsvVwNZXq0lUXJ92flqxI2Ix5dSsk9mRjJNR6hxC7PWyGrlBaXJXaSdQQZFif/JEv7JisXVDfF73Qoxa1S6SQFFR9YdG93EqW6LKrv+qjutqVabBQS1CH9SsUcf1uxWLD+/t2MTomi8oi/zSaG/isLO4URFM4PUm/aUpeAcG04+qd+gcgTcRh3jkaU1A1MrgNMlGpl8VK8Z/zUWUcyEZRFNpB47Go0pDdVa3ByjdZSK1MMWhJUI8PuiPPu0XM3Onaib4Q062OuOrM0Cc8Iak7VxPhB84asv7ctoRYQ56EKxyeBhprIZ8WPsnSB3SK5LSYrkhySns/QKXoffBt7m7giZtWw+2xgzTyjEl1N91P67yInyLLe4qA/P2I+z5oSkRl6Rsk/Zo6PRShOHQXcTZYom2TrXFicUVbtMEa1sK3Rqch5hRStOM/MmjsDtiSovXDTDLQuGFGvrmJUxIi5OiBFc4GmornWp732Fmn+S2mr/fXNhmXIzHj9SOoz0nqrNdsR3k10QTo6EtI6IKVzpGGixvRZyu6YMZs0G58hv4gOdqCOUeVmKLJu5aMjyQmkZtwzykYNaM/B61EPwsM0LfkpzU61km3NNbpSmpnV1u5OcsOiW3tRnAINZVlWptt3g+fbnYjHeJNI/qTOUKF1pjTmTeQJjAKmUkXSMLpvip564CgxkYzytEgnRg23ydEpo3b1RGKW9YF+at9cxmmTV2h+vEOcFRiq6LiI1EqnDv8DFMX/p0qKgIStifo5R1xKkEmJjE07Zxj+dR7nIFoiIDwHz2TaDjO/Eyqh25HE/w/Y7omSZoG071FjIqYieEnAItdnhRdSsKOxal2Q3Itsr0WnsZ3PaqEjxRPpJA2LUDxvNUrOwtjRqcMpGmYwWBrQynr5UiKMyEdHRjGKDs20sURrfeTZmkQB9fSyD0CGW7MGSDKsT0vvdi/ZrrTuSTORlZPSb1kSbSlQ3IvlPMAYqpv9liwTOwHZ6IRrRbr10aVJQQCsDAG6tv8HcAoVaSJluIMAAAAASUVORK5CYII=\"\n" +
        "}",
        jsonDataForMerge = JSON.parse(jsonString);

    const fragment1 = JSON.parse("{\"orderDetails\": \"<b>Quantity</b>:{{quantity}}, <b>Description</b>:{{description}}, <b>Amount</b>:{{amount}}\"}");
    const fragment2 = JSON.parse("{\"customerDetails\": \"{{customerName}}, Visits: {{customerVisits}}\"}");

    const fragmentsList = [fragment1, fragment2];

    // Create an ExecutionContext using credentials
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

    // Create a new DocumentMerge options instance
    const documentMerge = PDFServicesSdk.DocumentMerge,
        documentMergeOptions = documentMerge.options,
        options = new documentMergeOptions.DocumentMergeOptions(jsonDataForMerge, documentMergeOptions.OutputFormat.DOCX, fragmentsList);

    // Create a new operation instance using the options instance
    const documentMergeOperation = documentMerge.Operation.createNew(options);

    // Set operation input document template from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile('resources/documentMergeFragmentsTemplate.docx');
    documentMergeOperation.setInput(input);

    //Generating a file name
    let outputFilePath = createOutputFilePath();

    // Execute the operation and Save the result to the specified location.
    documentMergeOperation.execute(executionContext)
        .then(result => result.saveAsFile(outputFilePath))
        .catch(err => {
            if(err instanceof PDFServicesSdk.Error.ServiceApiError
                || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });

    //Generates a string containing a directory structure and file name for the output file.
    function createOutputFilePath() {
        let date = new Date();
        let dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
            ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
        return ("output/MergeDocumentToDOCXFragments/merge" + dateString + ".docx");
    }

} catch (err) {
    console.log('Exception encountered while executing operation', err);
}

