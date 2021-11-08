export const cards = [
    {
      "_id": "609ec1b0911ff20ecee45b05",
      "card_number": "32434234234234234",
      "is_pin_exempt": true,
      "id": "609ec1b0911ff20ecee45b05"
    },
    {
      "_id": "60b60d56baf7fc4552b751e8",
      "card_number": "0004442303987",
      "is_pin_exempt": false,
      "id": "60b60d56baf7fc4552b751e8"
    },
    {
      "_id": "20ecee45b064f20ecee45b05",
      "card_number": "1111234234234234",
      "is_pin_exempt": true,
      "id": "20ecee45b064f20ecee45b05"
    }
  ]
  
  export const fingerprints = [
    {
      "_id": "5lve2j8i85s06revoj9epxs0",
      "number": "338490249743592200",
      "is_pin_exempt": true,
      "id": "5lve2j8i85s06revoj9epxs0"
    },
    {
      "_id": "5ec2dbojc8s01rt6tdmnx7kw",
      "number": "444692824707862500",
      "is_pin_exempt": false,
      "id": "5ec2dbojc8s01rt6tdmnx7kw"
    },
    {
      "_id": "6yu8lg0t13804mc897dlhwy0",
      "number": "563224658996082560",
      "is_pin_exempt": true,
      "id": "6yu8lg0t13804mc897dlhwy0"
    }
  ]
  
  export const faceprints = [
    {
      "_id": "3quiowq8mdc02bgodi92k6sk",
      "number": "534449993503512500",
      "is_pin_exempt": true,
      "id": "3quiowq8mdc02bgodi92k6sk"
    },
    {
      "_id": "5by5u0n26yw02x7sxfn4u8u0",
      "number": "181759239628330750",
      "is_pin_exempt": false,
      "id": "5by5u0n26yw02x7sxfn4u8u0"
    },
    {
      "_id": "69t7aimt5ok07chyy64vbf00",
      "number": "859115600187274400",
      "is_pin_exempt": true,
      "id": "69t7aimt5ok07chyy64vbf00"
    }
  ]
  
  export const users = [
    {
        "confirmed": true,
        "blocked": false,
        "_id": "609ec1fb911ff20ecee45b06",
        "username": "cuser003",
        "email": "nerdrisky@gmail.com",
        "department": "IT",
        "mobile_phone": "+212690948026",
        "provider": "local",
        "group":[],
        "cards": [cards[0]],
        "fingerprints": [],
        "faceprints": [],
        "role": {
            "name": "Super Admin",
            "description": "Default role given to Super Admin user.",
            "type": "superadmin",
        },
        "id": "609ec1fb911ff20ecee45b06"
    },
    {
        "confirmed": true,
        "blocked": false,
        "_id": "6108f83ed84ac5646441a82b",
        "username": "auser001",
        "email": "fokrober@student.1337.ma",
        "department": "Staff",
        "provider": "local",
        "groups": [],
        "cards": [cards[1]],
        "faceprints": [faceprints[0]],
        "role": {
            "name": "Security",
            "description": "Default role given to security guards.",
            "type": "security",
        },
        "id": "6108f83ed84ac5646441a82b"
    },
    {
        "confirmed": true,
        "blocked": true,
        "_id": "20ecee45b06ac5646441a82b",
        "username": "buser002",
        "email": "fokrober@gmail.com",
        "department": "Student",
        "provider": "local",
        "groups": [],
        "cards": [cards[2]],
        "fingerprints": [fingerprints[0]],
        "faceprints": [faceprints[2]],
        "role": {
            "name": "Student",
            "description": "Default role given to Student.",
            "type": "student",
        },
        "id": "20ecee45b06ac5646441a82b"
    }
  ]