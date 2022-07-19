<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" rel="stylesheet" type="text/css">
    <style>
        body {
            margin: 0px;
            background-color: #f2f3f8;
        }
        #tableOne {
            font-family: 'Open Sans', sans-serif;
            width: 100%;
            background-color: #f2f3f8;
            border: none;
        }
        #tableTwo {
            background-color: #f2f3f8;
            max-width:670px;
            margin:0 auto;
            width: 100%;
        }
        #tableThree {
            max-width:670px;
            background:#fff;
            border-radius:3px;
            text-align:center;
            -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
            -moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
            box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
        }
        #header {
            height: 230px;
            background: #ff8d69;
            padding: 0 35px;
            width: 567px;
            margin: auto;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        h1 {
            color: white;
            font-size: 50px;
            letter-spacing: 18px;
        }
        h2 {
            color:#1e1e2d;
            font-weight:500;
            margin:0;
            font-size:32px;
            font-family:'Rubik',sans-serif;
        }
        h3 {
            color:#1e1e2d;
            font-weight:500;
            margin:0;
            font-size:26px;
            font-family:'Rubik',sans-serif;
        }
        #separator {
            display:inline-block;
            vertical-align:middle;
            margin:29px 0 26px;
            border-bottom:1px solid #cecece;
            width:100px;
        }
        p {
            text-align: left;
            color:#455056;
            font-size:15px;
            line-height:24px;
            margin:0;
        }
        #footer {
            text-align: center;
        }
        a {
            background:#ff8d69;
            text-decoration:none !important;
            font-weight:500;
            margin-top:35px;
            color:#fff;
            text-transform:uppercase;
            font-size:14px;
            padding:10px 24px;
            display:inline-block;
        }
    </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" leftmargin="0">
    <!--100% body table-->
    <table id="tableOne" cellspacing="0" border="0" cellpadding="0">
        <tr>
            <td>
                <table id="tableTwo" border="0" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;"></td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div id="header">
                                <h1>Social Push</h1>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table id="tableThree" width="95%" border="0" align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:40px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h2>Welcome! </h1>
                                        <h3>Your registration has been successful.</h2>
                                        <span id="separator"></span>
                                        <p>Here are your login credentials.</p>
                                        <br>
                                        <p><strong>Email: </strong> {{$mailData['mail']}}</p>
                                        <p><strong>Password: </strong> {{$mailData['password']}}</p>
                                        <a href="{{$mailData['loginUrl']}}" >Login to your account</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;"></td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p id="footer">&copy; <strong>Powered By Mgo360</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
