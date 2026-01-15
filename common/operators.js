const operatorList = [
  {
    OperatorCode: "AT",
    OperatorName: "Airtel",
  },
  {
    OperatorCode: "VF",
    OperatorName: "VodafoneIdea",
  },
  {
    OperatorCode: "BSNL",
    OperatorName: "BSNL TopUp",
  },

  {
    OperatorCode: "JIO",
    OperatorName: "Reliance Jio",
  },
  {
    OperatorCode: "ATP",
    OperatorName: "Airtel",
  },
  {
    OperatorCode: "VFP",
    OperatorName: "VodafoneIdea",
  },

  {
    OperatorCode: "RJC",
    OperatorName: "Reliance Jio",
  },
  {
    OperatorCode: "DTV",
    OperatorName: "Dish TV",
  },
  {
    OperatorCode: "TTV",
    OperatorName: "Tata Sky",
  },
  {
    OperatorCode: "VTV",
    OperatorName: "Videocon DTH",
  },
  {
    OperatorCode: "STV",
    OperatorName: "Sun Direct",
  },
  {
    OperatorCode: "ATV",
    OperatorName: "Airtel Digital TV",
  },

  {
    OperatorCode: "BRP",
    OperatorName: "BSES Rajdhani Power Ltd - Delhi",
  },
  {
    OperatorCode: "BYP",
    OperatorName: "BSES Yamuna Power Ltd - Delhi",
  },
  {
    OperatorCode: "TPD",
    OperatorName: "Tata Power - DELHI",
  },
  {
    OperatorCode: "NBELE",
    OperatorName: "NBPDCL - North Bihar Electricity",
  },
  {
    OperatorCode: "SBELE",
    OperatorName: "SBPDCL - South Bihar Electricity",
  },
  {
    OperatorCode: "BEMUM",
    OperatorName: "BEST Undertaking - MUMBAI",
  },
  {
    OperatorCode: "TP",
    OperatorName: "TORRENT POWER",
  },
  {
    OperatorCode: "UHBV",
    OperatorName: "UHBVN - Uttar Haryana Bijli Vitran Nigam",
  },
  {
    OperatorCode: "CEB",
    OperatorName: "CSPDCL-Chhattisgarh State Power Distribution Compa",
  },
  {
    OperatorCode: "DGVCL",
    OperatorName: "DGVCL - DAKSHIN GUJARAT VIJ COMPANY",
  },
  {
    OperatorCode: "MGVC",
    OperatorName: "MGVCL - MADHYA GUJARAT VIJ COMPANY",
  },
  {
    OperatorCode: "PGVC",
    OperatorName: "PGVCL - PASCHIM GUJARAT VIJ COMPANY",
  },
  {
    OperatorCode: "TNEB",
    OperatorName: "TNEB - TAMIL NADU",
  },
  {
    OperatorCode: "UGVC",
    OperatorName: "UGVCL - UTTAR GUJARAT VIJ COMPANY",
  },
  {
    OperatorCode: "AVVN",
    OperatorName: "Ajmer Vidyut Vitran Nigam - RAJASTHAN",
  },
  {
    OperatorCode: "JVVNL",
    OperatorName: "Jaipur Vidyut Vitran Nigam - RAJASTHAN",
  },
  {
    OperatorCode: "BESCOM",
    OperatorName: "BESCOM - BENGALURU",
  },
  {
    OperatorCode: "JOVVNL",
    OperatorName: "Jodhpur Vidyut Vitran Nigam - RAJASTHAN",
  },
  {
    OperatorCode: "MSEDCL",
    OperatorName: "MSEDCL - MAHARASHTRA",
  },
  {
    OperatorCode: "MPMKVVCL",
    OperatorName: "Madhya Kshetra Vitaran (Urban) - MADHYA PRADESH",
  },
  {
    OperatorCode: "NPCL",
    OperatorName: "Noida Power Company Limited",
  },
  {
    OperatorCode: "MPPKVI",
    OperatorName: "Paschim Kshetra Vitaran - MADHYA PRADESH",
  },
  {
    OperatorCode: "JUSCL",
    OperatorName: "JUSCO-Jamshedpur Utilities & Services Company Ltd",
  },
  {
    OperatorCode: "UPPCL",
    OperatorName: "UPPCL (URBAN) - UTTAR PRADESH",
  },
  {
    OperatorCode: "AAE",
    OperatorName: "APDCL (RAPDR) - ASSAM",
  },
  {
    OperatorCode: "TSEC",
    OperatorName: "TSECL - Tripura State Electricity Corporation",
  },
  {
    OperatorCode: "PSPCL",
    OperatorName: "PSPCL - Punjab State Power Corporation Limited ",
  },
  {
    OperatorCode: "APEPDCL",
    OperatorName: "APEPDCL- ANDHRA PRADESH Eastern",
  },
  {
    OperatorCode: "BPE",
    OperatorName: "BESL - BHARATPUR",
  },
  {
    OperatorCode: "BKE",
    OperatorName: "BKESL - BIKANER",
  },
  {
    OperatorCode: "CWE",
    OperatorName: "CESC - WEST BENGAL",
  },
  {
    OperatorCode: "DDE",
    OperatorName: "Daman and Diu Electricity",
  },
  {
    OperatorCode: "DHE",
    OperatorName: "DHBVN - Dakshin Haryana Bijli Vitran Nigam",
  },
  {
    OperatorCode: "DNE",
    OperatorName: "DNHPDCL - DADRA & NAGAR HAVELI",
  },
  {
    OperatorCode: "GKE",
    OperatorName: "GESCOM - KARNATAKA",
  },
  {
    OperatorCode: "KRE",
    OperatorName: "Kota Electricity Distribution - RAJASTHAN",
  },
  {
    OperatorCode: "MEE",
    OperatorName: "MEPDCL - MEGHALAYA",
  },
  {
    OperatorCode: "NOE",
    OperatorName: "NESCO - ODISHA",
  },
  {
    OperatorCode: "SOE",
    OperatorName: "SOUTHCO - ODISHA",
  },
  {
    OperatorCode: "TME",
    OperatorName: "Tata Power - MUMBAI",
  },
  {
    OperatorCode: "AJE",
    OperatorName: "TPADL - AJMER",
  },
  {
    OperatorCode: "UKE",
    OperatorName: "UPCL - UTTARAKHAND",
  },
  {
    OperatorCode: "WOE",
    OperatorName: "WESCO - ODISHA",
  },
  {
    OperatorCode: "APSPDCL",
    OperatorName: "APSPDCL - ANDHRA PRADESH SOUTH",
  },
  {
    OperatorCode: "URE",
    OperatorName: "UPPCL (RURAL) - UTTAR PRADESH",
  },
  {
    OperatorCode: "ANE",
    OperatorName: "APDCL (Non-RAPDR) - ASSAM",
  },
  {
    OperatorCode: "CKE",
    OperatorName: "CESCOM - KARNATAKA",
  },
  {
    OperatorCode: "HKE",
    OperatorName: "HESCOM - KARNATAKA",
  },
  {
    OperatorCode: "HPE",
    OperatorName: "Himachal Pradesh State Electricity Board",
  },
  {
    OperatorCode: "JBE",
    OperatorName: "JBVNL - JHARKHAND",
  },
  {
    OperatorCode: "MPMKUVCL",
    OperatorName: "Madhya Kshetra Vitaran (Rural) - MADHYA PRADESH",
  },
  {
    OperatorCode: "MPPUCL",
    OperatorName: "MP Poorv Kshetra Vitaran (Urban)",
  },
  {
    OperatorCode: "SKE",
    OperatorName: "Sikkim Power (Rural)",
  },
  {
    OperatorCode: "NME",
    OperatorName: "NDMC - DELHI",
  },
  {
    OperatorCode: "KUE",
    OperatorName: "KESCO - KANPUR",
  },
  {
    OperatorCode: "AME",
    OperatorName: "Adani Electricity - MUMBAI",
  },
  {
    OperatorCode: "KSE",
    OperatorName: "KSEBL - KERALA",
  },
  {
    OperatorCode: "GME",
    OperatorName: "Goa Electricity Department",
  },
  {
    OperatorCode: "MSE",
    OperatorName: "MESCOM - MANGALORE",
  },
  {
    OperatorCode: "PME",
    OperatorName: "Power & Electricity Department - MIZORAM",
  },
  {
    OperatorCode: "COEE",
    OperatorName: "CESU - ODISHA",
  },
  {
    OperatorCode: "PCE",
    OperatorName: "Electricity Department - PUDUCHERRY",
  },
  {
    OperatorCode: "SUE",
    OperatorName: "Sikkim Power (URBAN)",
  },
  {
    OperatorCode: "DOPN",
    OperatorName: "Department of Power, Nagaland",
  },
  {
    OperatorCode: "MPPKVVCJN",
    OperatorName: "MP Poorva Kshetra Vidyut Vitaran Co. Ltd Jabalpur ",
  },
  {
    OperatorCode: "DoPGoAP",
    OperatorName: "Department of Power, Government of Arunachal Pradesh",
  },
  {
    OperatorCode: "UPCL",
    OperatorName: "Uttarakhand Power Corporation Limited",
  },
  {
    OperatorCode: "JaKPDD",
    OperatorName: "Jammu and Kashmir Power Development Department",
  },
  {
    OperatorCode: "EDC",
    OperatorName: "Electricity Department Chandigarh",
  },
  {
    OperatorCode: "WBE",
    OperatorName: "West Bengal Electricity",
  },
  {
    OperatorCode: "GPCL",
    OperatorName: "Gift Power Company Limited",
  },
  {
    OperatorCode: "KDHPCPL",
    OperatorName: "Kannan Devan Hills Plantations Company Private Limited",
  },
  {
    OperatorCode: "DoPGoAP-P",
    OperatorName:
      "Department of Power, Government of Arunachal Pradesh - Prepaid",
  },
  {
    OperatorCode: "TCEDEL",
    OperatorName: "Thrissur Corporation Electricity Department",
  },
  {
    OperatorCode: "IND-UTP",
    OperatorName: "TP Renewables Microgrid Ltd.",
  },
  {
    OperatorCode: "IND-DEL",
    OperatorName: "BSES Rajdhani Prepaid Meter Recharge",
  },
  {
    OperatorCode: "IND-DEL",
    OperatorName: "BSES Yamuna Prepaid Meter Recharge",
  },
  {
    OperatorCode: "IND11009",
    OperatorName: "APCPDCL- ANDHRA PRADESH CENTRAL",
  },
  {
    OperatorCode: "IND11178",
    OperatorName:
      "TP Southen Odisha Distribution Ltd-Smart Prepaid Meter Recharge",
  },
  {
    OperatorCode: "IND11236",
    OperatorName: "India Power Corporation Limited (IPCL)",
  },
  {
    OperatorCode: "IND11246",
    OperatorName:
      "Dadra and Nagar Haveli and Daman and Diu Power Distribution Corporation Limited",
  },
  {
    OperatorCode: "IND11309",
    OperatorName: "Hukkeri Rural Electric CoOperative Society Ltd",
  },
  {
    OperatorCode: "IND11316",
    OperatorName:
      "Purvanchal Vidyut Vitran Nigam Limited(PUVVNL)(Postpaid and Smart Prepaid Meter Recharge)",
  },
  {
    OperatorCode: "IND11335",
    OperatorName:
      "Paschimanchal Vidyut Vitran Nigam Limited (PVVNL)(Postpaid and Smart Prepaid Meter Recharge)",
  },
  {
    OperatorCode: "IND11357",
    OperatorName: "Vaghani Energy Limited",
  },
  {
    OperatorCode: "IND11431",
    OperatorName:
      "Dakshinanchal Vidyut Vitran Nigam Limited (DVVNL)(Postpaid and Smart Prepaid Meter Recharge)",
  },
  {
    OperatorCode: "IND11521",
    OperatorName: "Dakshin Gujarat Vij Company Limited (DGVCL)-Fetch and pay",
  },
  {
    OperatorCode: "IND11523",
    OperatorName: "Madhya Gujarat Vij Company Limited (MGVCL)-Fetch and pay",
  },
  {
    OperatorCode: "IND11525",
    OperatorName: "Paschim Gujarat Vij Company Limited (PGVCL)-Fetch and pay",
  },
  {
    OperatorCode: "IND11528",
    OperatorName: "Uttar Gujarat Vij Company Limited (UGVCL)-Fetch and pay",
  },

  {
    OperatorCode: "AFT",
    OperatorName: "Indian Highways Management Company",
  },
  {
    OperatorCode: "KMB-F",
    OperatorName: "Kotak Mahindra Bank - Fastag",
  },
  {
    OperatorCode: "IFB-F",
    OperatorName: "IDFC FIRST Bank - FasTag",
  },
  {
    OperatorCode: "EFR",
    OperatorName: "Equitas FASTag Recharge",
  },
  {
    OperatorCode: "HB-F",
    OperatorName: "HDFC  Bank - Fastag",
  },
  {
    OperatorCode: "JaKBF",
    OperatorName: "Jammu and Kashmir Bank Fastag",
  },
  {
    OperatorCode: "BOBFSTG",
    OperatorName: "Bank of Baroda - Fastag",
  },
  {
    OperatorCode: "IOBFT",
    OperatorName: "IOB Fastag",
  },
  {
    OperatorCode: "UCOBFT",
    OperatorName: "UCO Bank Fastag",
  },
  {
    OperatorCode: "IND10937",
    OperatorName: "Karnataka Bank Fastag",
  },
  {
    OperatorCode: "APBFT",
    OperatorName: "Airtel Payments Bank NETC FASTag",
  },
  {
    OperatorCode: "IND11002",
    OperatorName: "IDBI Bank Fastag",
  },
  {
    OperatorCode: "PAYTMFT",
    OperatorName: "Paytm Payments Bank FASTag",
  },
  {
    OperatorCode: "IND11004",
    OperatorName: "Axis Bank FASTag",
  },
  {
    OperatorCode: "IND11007",
    OperatorName: "Federal Bank - FASTag",
  },
  {
    OperatorCode: "IND11008",
    OperatorName: "ICICI Bank Fastag",
  },
  {
    OperatorCode: "INDUSFT",
    OperatorName: "IndusInd Bank FASTag",
  },
  {
    OperatorCode: "IND11194",
    OperatorName: "Indian Bank Fastag Recharge",
  },
  {
    OperatorCode: "IND11235",
    OperatorName: "Bank of Maharashtra FASTag",
  },

  {
    OperatorCode: "BSL",
    OperatorName: "BSNL - Individual",
  },
  {
    OperatorCode: "MDL",
    OperatorName: "MTNL - Delhi",
  },
  {
    OperatorCode: "ATL",
    OperatorName: "Airtel",
  },
  {
    OperatorCode: "MML",
    OperatorName: "MTNL - Mumbai",
  },
  {
    OperatorCode: "BCL",
    OperatorName: "BSNL - Corporate",
  },
  {
    OperatorCode: "TDCLE",
    OperatorName: "Tata Docomo CDMA Landline",
  },
  {
    OperatorCode: "Bl-C",
    OperatorName: "BSNL landline - Corporate",
  },
  {
    OperatorCode: "Bl-I",
    OperatorName: "BSNL landline - Individiual",
  },

  {
    OperatorCode: "MMG",
    OperatorName: "Mahanagar Gas",
  },
  {
    OperatorCode: "GGCO",
    OperatorName: "Gujarat Gas Company",
  },
  {
    OperatorCode: "ING",
    OperatorName: "Indraprastha Gas",
  },
  {
    OperatorCode: "ADG",
    OperatorName: "Adani Gas - GUJARAT",
  },
  {
    OperatorCode: "AHG",
    OperatorName: "Adani Gas - HARYANA",
  },
  {
    OperatorCode: "HCG",
    OperatorName: "Haryana City Gas",
  },
  {
    OperatorCode: "SUG",
    OperatorName: "Siti Energy",
  },
  {
    OperatorCode: "TNG",
    OperatorName: "Tripura Natural Gas",
  },
  {
    OperatorCode: "UCG",
    OperatorName: "Unique Central Piped Gases",
  },
  {
    OperatorCode: "VGG",
    OperatorName: "Vadodara Gas",
  },
  {
    OperatorCode: "MNG",
    OperatorName: "Maharashtra Natural Gas\t",
  },
  {
    OperatorCode: "AVG",
    OperatorName: "Aavantika Gas",
  },
  {
    OperatorCode: "CUG",
    OperatorName: "Central UP Gas Limited",
  },
  {
    OperatorCode: "CGG",
    OperatorName: "Charotar Gas Sahakari Mandali",
  },
  {
    OperatorCode: "IAG",
    OperatorName: "IndianOil - Adani Gas",
  },
  {
    OperatorCode: "AGG",
    OperatorName: "Assam Gas Company",
  },
  {
    OperatorCode: "GGG",
    OperatorName: "Green Gas",
  },
  {
    OperatorCode: "IRG",
    OperatorName: "IRM Energy",
  },
  {
    OperatorCode: "GGLD",
    OperatorName: "GAIL Gas Limited",
  },
  {
    OperatorCode: "BNGLD",
    OperatorName: "Bhagyanagar Gas Limited",
  },
  {
    OperatorCode: "ANG",
    OperatorName: "Adani Gas",
  },
  {
    OperatorCode: "MG",
    OperatorName: "Megha Gas",
  },
  {
    OperatorCode: "NGPL",
    OperatorName: "Naveriya Gas Pvt Ltd",
  },
  {
    OperatorCode: "HCG-KCE-O",
    OperatorName: "Haryana City Gas - Kapil Chopra Enterprise - Old",
  },
  {
    OperatorCode: "SGL",
    OperatorName: "Sanwariya Gas Limited",
  },
  {
    OperatorCode: "GIL",
    OperatorName: "Gail India Limited",
  },
  {
    OperatorCode: "GSPL",
    OperatorName: "Gujarat State Petronet Limited",
  },
  {
    OperatorCode: "INDOILGAS",
    OperatorName: "Indian Oil Corporation Ltd-Piped Gas",
  },
  {
    OperatorCode: "IND11064",
    OperatorName: "Purba Bharati Gas Pvt Ltd",
  },
  {
    OperatorCode: "IND11267",
    OperatorName: "HP Oil Gas Private Limited",
  },
  {
    OperatorCode: "IND11323",
    OperatorName: "Hindustan Petroleum Corporation Ltd-Piped Gas",
  },
  {
    OperatorCode: "IND11413",
    OperatorName: "AGP CGD India Pvt Ltd",
  },
  {
    OperatorCode: "IND11414",
    OperatorName: "AGP City Gas Pvt Ltd",
  },
  {
    OperatorCode: "IND11507",
    OperatorName: "Godavari Gas Pvt Ltd",
  },

  {
    OperatorCode: "IND11041",
    OperatorName: "Cybernetics Secondary School",
  },
  {
    OperatorCode: "IND11042",
    OperatorName: "Millennium College Of Nursing",
  },
  {
    OperatorCode: "IND11043",
    OperatorName: "Vivekananda Mission High School",
  },
  {
    OperatorCode: "IND11044",
    OperatorName: "Meerut Institute Of Technology",
  },
  {
    OperatorCode: "IND11045",
    OperatorName: "Pushpa Sr. Secondary School",
  },
  {
    OperatorCode: "IND11046",
    OperatorName: "Uttarakhand Ayurved University",
  },
  {
    OperatorCode: "IND11047",
    OperatorName: "Lilawati Vidya Mandir School",
  },
  {
    OperatorCode: "IND11048",
    OperatorName: "Sai Educational Charitable Trust",
  },
  {
    OperatorCode: "IND11049",
    OperatorName: "Sri Venkateswara College Of Engineering",
  },
  {
    OperatorCode: "IND11050",
    OperatorName: "Millenium College Of Education",
  },
  {
    OperatorCode: "IND11051",
    OperatorName: "Gurukul Living  Solutions",
  },
  {
    OperatorCode: "IND11052",
    OperatorName: "Geethanjali Institute Of Science and Technology",
  },
  {
    OperatorCode: "IND11053",
    OperatorName: "Millennium Institute Of Technology And Science",
  },
  {
    OperatorCode: "IND11054",
    OperatorName: "Millennium College Of Pharmacy and Science",
  },
  {
    OperatorCode: "IND11055",
    OperatorName: "New Hope High School(E.M.)",
  },
  {
    OperatorCode: "IND11056",
    OperatorName: "Millennium College Of Pharmacy",
  },
  {
    OperatorCode: "IND11057",
    OperatorName: "NSB Academy",
  },
  {
    OperatorCode: "IND11058",
    OperatorName: "Millennium College Of Management",
  },
  {
    OperatorCode: "IND11062",
    OperatorName: "Footwear Design and Development Institute",
  },
  {
    OperatorCode: "IND11072",
    OperatorName: "Ingraham Institute Senior Secondary School",
  },
  {
    OperatorCode: "IND11079",
    OperatorName: "The Apparel Training and Design Center",
  },
  {
    OperatorCode: "IND11096",
    OperatorName: "YS School Barnala",
  },
  {
    OperatorCode: "IND11097",
    OperatorName: "TMM College of Nursing",
  },
  {
    OperatorCode: "IND11098",
    OperatorName: "St. Marys Polytechnic College",
  },
  {
    OperatorCode: "IND11099",
    OperatorName: "St. Marys Private ITI",
  },
  {
    OperatorCode: "IND11100",
    OperatorName: "St. Dominics College PG",
  },
  {
    OperatorCode: "IND11101",
    OperatorName: "St. Dominics College UG",
  },
  {
    OperatorCode: "IND11102",
    OperatorName: "St. Anns HSS Eloor",
  },
  {
    OperatorCode: "IND11107",
    OperatorName: "Bishop Speechly College for Advance Studies",
  },
  {
    OperatorCode: "IND11108",
    OperatorName: "G Ramasamy Institutional Services Private Limited",
  },
  {
    OperatorCode: "IND11109",
    OperatorName: "Nazareth College of Pharmacy",
  },
  {
    OperatorCode: "IND11139",
    OperatorName: "Guru Tegh Bahadur Institute Of Technology",
  },
  {
    OperatorCode: "IND11140",
    OperatorName: "Gurukul Public School, Govindpur",
  },
  {
    OperatorCode: "IND11144",
    OperatorName: "Mary Immaculate High School",
  },
  {
    OperatorCode: "IND11174",
    OperatorName: "Matra Bhasha Vidhyalaya",
  },
  {
    OperatorCode: "IND11175",
    OperatorName: "Indian Institute Of Mass Communication",
  },
  {
    OperatorCode: "IND11179",
    OperatorName: "Air Force School Suratgarh",
  },
  {
    OperatorCode: "IND11180",
    OperatorName: "Zoom International School",
  },
  {
    OperatorCode: "IND11181",
    OperatorName: "Holy Cross School Hazaribagh",
  },
  {
    OperatorCode: "IND11182",
    OperatorName: "Awasiya Public School",
  },
  {
    OperatorCode: "IND11189",
    OperatorName: "Doon Public School",
  },
  {
    OperatorCode: "IND11190",
    OperatorName: "Maharaja Ganga Singh College",
  },
  {
    OperatorCode: "IND11193",
    OperatorName: "Chhotu Ram Rural Institute Of Technology",
  },
  {
    OperatorCode: "IND11208",
    OperatorName: "SBI Officers Association Education Society",
  },
  {
    OperatorCode: "IND11209",
    OperatorName: "Sulagna Higher Secondary School",
  },
  {
    OperatorCode: "IND11220",
    OperatorName: "Mothers Public School",
  },
  {
    OperatorCode: "IND11224",
    OperatorName: "Little Kingdom School",
  },
  {
    OperatorCode: "IND11230",
    OperatorName: "Government Madhav Arts and Commerce College",
  },
  {
    OperatorCode: "IND11263",
    OperatorName: "Emerald Heights Higher Secondary School",
  },
  {
    OperatorCode: "IND11290",
    OperatorName: "AL AMAL Public School",
  },
  {
    OperatorCode: "IND11341",
    OperatorName: "WD Educational Trust",
  },
  {
    OperatorCode: "IND11352",
    OperatorName: "GVMS KG And Primary School",
  },
  {
    OperatorCode: "IND11512",
    OperatorName: "R S Roy Paramedical Research Institute Bsc Opthalmic",
  },
  {
    OperatorCode: "IND11536",
    OperatorName: "Visvodaya Institute Of Technology And Science Kavali",
  },
  {
    OperatorCode: "IND11549",
    OperatorName: "Chandigarh University",
  },

  {
    OperatorCode: "ILI",
    OperatorName: "ICICI Prudential Life Insurance",
  },
  {
    OperatorCode: "HDI",
    OperatorName: "HDFC Life Insurance",
  },
  {
    OperatorCode: "LIC",
    OperatorName: "LIC of INDIA",
  },
  {
    OperatorCode: "BALICL",
    OperatorName: "Bajaj Allianz Life Insurance Company Limited",
  },
  {
    OperatorCode: "ALI",
    OperatorName: "Aegon Life Insurance",
  },
  {
    OperatorCode: "RGICL",
    OperatorName: "Reliance General Insurance Company LTD",
  },
  {
    OperatorCode: "MH-HI",
    OperatorName: "Magma HDI - Health Insurance",
  },
  {
    OperatorCode: "MBHI",
    OperatorName: "Max Bupa Health Insurance",
  },
  {
    OperatorCode: "RSGICL",
    OperatorName: "Royal Sundaram General Insurance Co. Limited",
  },
  {
    OperatorCode: "MH-LI",
    OperatorName: "Magma HDI - Life Insurance",
  },
  {
    OperatorCode: "SGI",
    OperatorName: "Shriram General Insurance",
  },
  {
    OperatorCode: "MH-MI",
    OperatorName: "Magma HDI - Motor Insurance",
  },
  {
    OperatorCode: "AVLI",
    OperatorName: "Aviva Life Insurance",
  },
  {
    OperatorCode: "BAGI",
    OperatorName: "Bajaj Allianz General Insurance",
  },
  {
    OperatorCode: "CHOLI",
    OperatorName: "Canara HSBC OBC Life Insurance",
  },
  {
    OperatorCode: "MLICL",
    OperatorName: "Max Life Insurance Company Limited",
  },
  {
    OperatorCode: "ABHICL",
    OperatorName: "Aditya Birla Health Insurance Co Limited",
  },
  {
    OperatorCode: "AFLICL",
    OperatorName: "Ageas Federal Life Insurance Company Limited",
  },
  {
    OperatorCode: "IPLI-N",
    OperatorName: "ICICI Prudential Life Insurance - New",
  },
  {
    OperatorCode: "ELI",
    OperatorName: "Exide Life Insurance",
  },
  {
    OperatorCode: "PLIL",
    OperatorName: "Pramerica Life Insurance Limited",
  },
  {
    OperatorCode: "ICICILGI",
    OperatorName: "ICICI Lombard General Insurance (Motor)",
  },
  {
    OperatorCode: "INDIAFLIC",
    OperatorName: "IndiaFirst Life Insurance Company Ltd",
  },
  {
    OperatorCode: "GODGIL",
    OperatorName: "Go Digit General Insurance Limited",
  },
  {
    OperatorCode: "RHINS",
    OperatorName: "Reliance Health Insurance",
  },
  {
    OperatorCode: "IND10835",
    OperatorName: "Shriram Life Insurance Co. Ltd.",
  },
  {
    OperatorCode: "ABSLII",
    OperatorName: "Aditya Birla Sun Life Insurance",
  },
  {
    OperatorCode: "IFFTGICI",
    OperatorName: "Iffco Tokio General Insurance Company Limited",
  },
  {
    OperatorCode: "FGILII",
    OperatorName: "Future Generali India Life Insurance Company Limit",
  },
  {
    OperatorCode: "SUDILII",
    OperatorName: "Star Union Dai Ichi Life Insurance",
  },
  {
    OperatorCode: "HLII",
    OperatorName: "HDFC Life Insurance",
  },
  {
    OperatorCode: "BAXALII",
    OperatorName: "BHARTI AXA Life Insurance",
  },
  {
    OperatorCode: "IND10913",
    OperatorName: "Manipal Cigna Health Insurance",
  },
  {
    OperatorCode: "IND10927",
    OperatorName: "The Oriental Insurance Company Limited",
  },
  {
    OperatorCode: "IND10941",
    OperatorName: "Star Health And Allied Insurance Company",
  },
  {
    OperatorCode: "IND10959",
    OperatorName: "Shriram General Insurance - Quote Payment",
  },
  {
    OperatorCode: "IND10990",
    OperatorName: "ICICI Lombard General Insurance (Health)",
  },
  {
    OperatorCode: "IND11338",
    OperatorName: "TATA AIG General Insurance co. Ltd Retail",
  },
  {
    OperatorCode: "IND11455",
    OperatorName: "HDFC ERGO General Insurance (Motor)",
  },
  {
    OperatorCode: "IND11502",
    OperatorName: "Acko General Insurance Health",
  },
  {
    OperatorCode: "IND11503",
    OperatorName: "Acko General Insurance Motor",
  },
  {
    OperatorCode: "IND11513",
    OperatorName: "Sbi General Health Insurance",
  },
  {
    OperatorCode: "IND11514",
    OperatorName: "SBI General Motor Insurance",
  },
  {
    OperatorCode: "IND11519",
    OperatorName: "Bajaj Finance Ltd - Corporate agent",
  },
  {
    OperatorCode: "IND11526",
    OperatorName: "Pnb Metlife India Insurance Company Ltd",
  },
  {
    OperatorCode: "IND11540",
    OperatorName: "Future Generali India Insurance Co ltd-General Insurance",
  },
  {
    OperatorCode: "IND11571",
    OperatorName: "Zuno General Insurance",
  },

  {
    OperatorCode: "BBT",
    OperatorName: "Bank of Baroda",
  },
  {
    OperatorCode: "BRL",
    OperatorName: "Bajaj Finance",
  },
  {
    OperatorCode: "FSL",
    OperatorName: "FlexSalary",
  },
  {
    OperatorCode: "IFL",
    OperatorName: "IDFC FIRST Bank",
  },
  {
    OperatorCode: "LTL",
    OperatorName: "L&T Financial Services",
  },
  {
    OperatorCode: "LSL",
    OperatorName: "LokSuvidha",
  },
  {
    OperatorCode: "MOL",
    OperatorName: "Motilal Oswal Home Finance",
  },
  {
    OperatorCode: "PDL",
    OperatorName: "Paisa Dukan",
  },
  {
    OperatorCode: "SML",
    OperatorName: "Snapmint",
  },
  {
    OperatorCode: "TAL",
    OperatorName: "Tata Capital",
  },
  {
    OperatorCode: "BAF",
    OperatorName: "Bajaj Auto Finance",
  },
  {
    OperatorCode: "AFSL",
    OperatorName: "Avanse Financial Services Ltd",
  },
  {
    OperatorCode: "SCUFL",
    OperatorName: "Shriram City  Union Finance Ltd",
  },
  {
    OperatorCode: "CGHF",
    OperatorName: "Capri Global Housing Finance",
  },
  {
    OperatorCode: "CFSPL",
    OperatorName: "Cars24 Financial Services Private Limited",
  },
  {
    OperatorCode: "HCIFPL",
    OperatorName: "Home Credit India Finance Pvt. Ltd",
  },
  {
    OperatorCode: "JSFB",
    OperatorName: "Jana Small Finance Bank",
  },
  {
    OperatorCode: "EKFL",
    OperatorName: "Ess Kay Fincorp Limited",
  },
  {
    OperatorCode: "K",
    OperatorName: "Kissht",
  },
  {
    OperatorCode: "SHFL",
    OperatorName: "Shriram Housing Finance Limited",
  },
  {
    OperatorCode: "AFL",
    OperatorName: "AAVAS FINANCIERS LIMITED",
  },
  {
    OperatorCode: "ORO",
    OperatorName: "Oroboro",
  },
  {
    OperatorCode: "iFER",
    OperatorName: "i2i Funding-Borrower EMI Repayment",
  },
  {
    OperatorCode: "MUML",
    OperatorName: "Muthoot Microfin Limited",
  },
  {
    OperatorCode: "MIDML",
    OperatorName: "Midland Microfin Ltd",
  },
  {
    OperatorCode: "USFB",
    OperatorName: "Ujjivan Small Finance Bank",
  },
  {
    OperatorCode: "FEA",
    OperatorName: "Faircent-Borrower EMI Account",
  },
  {
    OperatorCode: "MFPL",
    OperatorName: "Mintifi Finserve Private Limited",
  },
  {
    OperatorCode: "TFS",
    OperatorName: "Toyota Financial Services",
  },
  {
    OperatorCode: "DBLR",
    OperatorName: "DCB Bank Loan Repayment",
  },
  {
    OperatorCode: "ABHFL",
    OperatorName: "Aditya Birla Housing Finance Limited",
  },
  {
    OperatorCode: "IHLL",
    OperatorName: "India Home Loan Limited",
  },
  {
    OperatorCode: "ASCC",
    OperatorName: "Ascend Capital",
  },
  {
    OperatorCode: "CWC",
    OperatorName: "Credit Wise Capital",
  },
  {
    OperatorCode: "HFSPL",
    OperatorName: "Hiranandani Financial Services Pvt  Ltd",
  },
  {
    OperatorCode: "OHM",
    OperatorName: "OHMYLOAN",
  },
  {
    OperatorCode: "ARFSL",
    OperatorName: "Arohan Financial Services Ltd",
  },
  {
    OperatorCode: "KFL",
    OperatorName: "Kanakadurga Finance Limited",
  },
  {
    OperatorCode: "MHF",
    OperatorName: "Mahindra Home Finance",
  },
  {
    OperatorCode: "NF",
    OperatorName: "Nidhilakshmi Finance",
  },
  {
    OperatorCode: "ABLR",
    OperatorName: "AU Bank Loan Repayment",
  },
  {
    OperatorCode: "STFCL",
    OperatorName: "Shriram Transport Finance Company Limited",
  },
  {
    OperatorCode: "VHFCL",
    OperatorName: "Vastu Housing Finance Corporation Limited",
  },
  {
    OperatorCode: "FIccl",
    OperatorName: "Fullerton India credit company limited",
  },
  {
    OperatorCode: "NMF",
    OperatorName: "NM Finance",
  },
  {
    OperatorCode: "HFFCIL",
    OperatorName: "Home First Finance Company India Limited",
  },
  {
    OperatorCode: "R",
    OperatorName: "RupeeRedee",
  },
  {
    OperatorCode: "MCAIL",
    OperatorName: "Maxvalue Credits And Investments Ltd",
  },
  {
    OperatorCode: "V",
    OperatorName: "Varthana",
  },
  {
    OperatorCode: "Z",
    OperatorName: "ZestMoney",
  },
  {
    OperatorCode: "OMLP",
    OperatorName: "OMLP2P.COM",
  },
  {
    OperatorCode: "LCPPL",
    OperatorName: "LOANTAP CREDIT PRODUCTS PRIVATE LIMITED",
  },
  {
    OperatorCode: "EFPL",
    OperatorName: "Eduvanz Financing Pvt. Ltd.",
  },
  {
    OperatorCode: "CGCL",
    OperatorName: "Capri Global Capital Limited",
  },
  {
    OperatorCode: "IBL-L",
    OperatorName: "ICICI Bank Ltd - Loans",
  },
  {
    OperatorCode: "F",
    OperatorName: "FlexiLoans",
  },
  {
    OperatorCode: "AFPLMS",
    OperatorName: "Annapurna Finance Private Limited-MSME",
  },
  {
    OperatorCode: "FIHFL",
    OperatorName: "Fullerton India Housing Finance Limited",
  },
  {
    OperatorCode: "MFLL",
    OperatorName: "Manappuram Finance Limited-Vehicle Loan",
  },
  {
    OperatorCode: "CIFCPL",
    OperatorName: "Chaitanya India Fin Credit Pvt Ltd",
  },
  {
    OperatorCode: "HFL",
    OperatorName: "Hero FinCorp Limited",
  },
  {
    OperatorCode: "AXFL",
    OperatorName: "Axis Finance Limited",
  },
  {
    OperatorCode: "ISFCL",
    OperatorName: "India Shelter Finance Corporation Limited",
  },
  {
    OperatorCode: "ACHF",
    OperatorName: "Altum Credo Home Finance",
  },
  {
    OperatorCode: "ACPL",
    OperatorName: "Adani Capital Pvt Ltd",
  },
  {
    OperatorCode: "BFL",
    OperatorName: "BERAR Finance Limited",
  },
  {
    OperatorCode: "GUFSPL",
    OperatorName: "G U Financial Services Pvt Ltd",
  },
  {
    OperatorCode: "ICFL",
    OperatorName: "Indiabulls Consumer Finance Limited",
  },
  {
    OperatorCode: "IHFL",
    OperatorName: "Indiabulls Housing Finance Limited",
  },
  {
    OperatorCode: "JA",
    OperatorName: "Jain Autofin",
  },
  {
    OperatorCode: "IB-C",
    OperatorName: "INDUSIND BANK - CFD",
  },
  {
    OperatorCode: "KC",
    OperatorName: "Kinara Capital",
  },
  {
    OperatorCode: "AFPL",
    OperatorName: "Annapurna Finance Private Limited-MFI",
  },
  {
    OperatorCode: "MCSL",
    OperatorName: "Muthoot Capital Services Ltd",
  },
  {
    OperatorCode: "HFCL",
    OperatorName: "Hero FinCorp Limited",
  },
  {
    OperatorCode: "DCL",
    OperatorName: "Digamber Capfin Limited",
  },
  {
    OperatorCode: "EHFL",
    OperatorName: "Easy Home Finance Limited",
  },
  {
    OperatorCode: "SMPL",
    OperatorName: "Svatantra Microfin Private Limited",
  },
  {
    OperatorCode: "BLaF",
    OperatorName: "Baid Leasing and Finance",
  },
  {
    OperatorCode: "OFSPL",
    OperatorName: "Oxyzo Financial Services Pvt Ltd",
  },
  {
    OperatorCode: "C",
    OperatorName: "Clix",
  },
  {
    OperatorCode: "MT",
    OperatorName: "MoneyTap",
  },
  {
    OperatorCode: "IIFL",
    OperatorName: "IIFL Home Finance",
  },
  {
    OperatorCode: "LMPL",
    OperatorName: "Light Microfinance Private Limited",
  },
  {
    OperatorCode: "IIFLF",
    OperatorName: "IIFL Finance Limited",
  },
  {
    OperatorCode: "CG-M",
    OperatorName: "CreditAccess Grameen - Microfinance",
  },
  {
    OperatorCode: "CG-RF",
    OperatorName: "CreditAccess Grameen - Retail Finance",
  },
  {
    OperatorCode: "TC",
    OperatorName: "TVS Credit",
  },
  {
    OperatorCode: "BFIL",
    OperatorName: "Bharat Financial Inclusion Ltd",
  },
  {
    OperatorCode: "ORFIPL",
    OperatorName: "Orange Retail Finance India Pvt Ltd",
  },
  {
    OperatorCode: "PF",
    OperatorName: "Pooja Finelease",
  },
  {
    OperatorCode: "VFsPL",
    OperatorName: "Vistaar Financial services Private Limited",
  },
  {
    OperatorCode: "ABL",
    OperatorName: "Axis Bank Limited-Microfinance",
  },
  {
    OperatorCode: "INCRED",
    OperatorName: "InCred",
  },
  {
    OperatorCode: "NAFAPL",
    OperatorName: "Netafim Agricultural Financing Agency Pvt. Ltd.",
  },
  {
    OperatorCode: "KMPL",
    OperatorName: "Kotak Mahindra Prime Limited",
  },
  {
    OperatorCode: "KMBL",
    OperatorName: "Kotak Mahindra Bank Ltd.-Loans",
  },
  {
    OperatorCode: "SML",
    OperatorName: "Samasta Microfinance Limited",
  },
  {
    OperatorCode: "ICCL",
    OperatorName: "Indiabulls Commercial Credit Ltd",
  },
  {
    OperatorCode: "NFL",
    OperatorName: "Novelty Finance Ltd",
  },
  {
    OperatorCode: "TNL",
    OperatorName: "Thazhayil Nidhi Ltd",
  },
  {
    OperatorCode: "AVHFIL",
    OperatorName: "Aptus Value Housing Finance India Limited",
  },
  {
    OperatorCode: "MC",
    OperatorName: "Mitron Capital",
  },
  {
    OperatorCode: "AFIPL",
    OperatorName: "Aptus Finance India Private Limited",
  },
  {
    OperatorCode: "XFSL",
    OperatorName: "X10 Financial Services Limited",
  },
  {
    OperatorCode: "AMIL-A",
    OperatorName: "Agora Microfinance India Ltd - AMIL",
  },
  {
    OperatorCode: "MHFCL",
    OperatorName: "Muthoot Housing Finance Company Limited",
  },
  {
    OperatorCode: "MaMFSL",
    OperatorName: "Mahindra and Mahindra Financial Services Limited",
  },
  {
    OperatorCode: "ESFB(L",
    OperatorName: "ESAF Small Finance Bank (Micro Loans)",
  },
  {
    OperatorCode: "YLL",
    OperatorName: "Yogakshemam Loans Ltd",
  },
  {
    OperatorCode: "RPCOBL",
    OperatorName: "Rander Peoples Co Operative Bank Ltd",
  },
  {
    OperatorCode: "ABFL",
    OperatorName: "Aditya Birla Finance Limited",
  },
  {
    OperatorCode: "FCPL",
    OperatorName: "Finova Capital Private Ltd",
  },
  {
    OperatorCode: "AFIPL",
    OperatorName: "Ayaan Finserve India Private LTD",
  },
  {
    OperatorCode: "SIFPL",
    OperatorName: "Sarvjan India Fintech Private Limited",
  },
  {
    OperatorCode: "AHFL",
    OperatorName: "Aadhar Housing Finance Limited",
  },
  {
    OperatorCode: "IFSPL",
    OperatorName: "IDF Financial Services Private Limited",
  },
  {
    OperatorCode: "EQIML",
    OperatorName: "Equitas SFB - Microfinance Loan",
  },
  {
    OperatorCode: "ZIPL",
    OperatorName: "Ziploan",
  },
  {
    OperatorCode: "DTPLLP",
    OperatorName: "Diwakar Tracom Private Limited",
  },
  {
    OperatorCode: "HINMLLP",
    OperatorName: "Hindon Mercantile Limited - Mufin",
  },
  {
    OperatorCode: "INDOHMPLLP",
    OperatorName: "Indostar Home Finance Private Limited",
  },
  {
    OperatorCode: "LWLRP",
    OperatorName: "Loan2Wheels",
  },
  {
    OperatorCode: "MUTMNYLP",
    OperatorName: "Muthoot Money",
  },
  {
    OperatorCode: "RCLP",
    OperatorName: "Rupee Circle",
  },
  {
    OperatorCode: "HDBFSL",
    OperatorName: "HDB Financial Services Limited",
  },
  {
    OperatorCode: "ICFLSME",
    OperatorName: "Indostar Capital Finance Limited - SME",
  },
  {
    OperatorCode: "AYEFIN",
    OperatorName: "Aye Finance Pvt. Ltd.",
  },
  {
    OperatorCode: "CRISSFHL",
    OperatorName: "Criss Financial Holdings Ltd",
  },
  {
    OperatorCode: "EQUITFBLP",
    OperatorName: "Equitas Small Finance Bank - Retail Loan",
  },
  {
    OperatorCode: "SSFLLP",
    OperatorName: "Spandana Sphoorty Financial Ltd",
  },
  {
    OperatorCode: "MDFCFCLLP",
    OperatorName: "MDFC Financiers Pvt Ltd",
  },
  {
    OperatorCode: "RMKFPL",
    OperatorName: "RMK Fincorp Pvt Ltd",
  },
  {
    OperatorCode: "AMFLLP",
    OperatorName: "Asirvad Micro Finance Ltd",
  },
  {
    OperatorCode: "SMMLLP",
    OperatorName: "SMILE Microfinance Limited",
  },
  {
    OperatorCode: "LICHFLLP",
    OperatorName: "LIC Housing Finance Limited",
  },
  {
    OperatorCode: "PFSPLLP",
    OperatorName: "Pahal Financial Services Pvt Ltd",
  },
  {
    OperatorCode: "DCBSLRE",
    OperatorName: "DCBS Loan",
  },
  {
    OperatorCode: "RELARCLR",
    OperatorName: "Reliance ARC",
  },
  {
    OperatorCode: "IND10875",
    OperatorName: "Muthoot Homefin Limited",
  },
  {
    OperatorCode: "ElectrLR",
    OperatorName: "Electronica Finance Limited",
  },
  {
    OperatorCode: "MoneFINLR",
    OperatorName: "Moneywise Financial Services Private Limited",
  },
  {
    OperatorCode: "SuryodayLR",
    OperatorName: "Suryoday Small Finance Bank",
  },
  {
    OperatorCode: "SpanRULR",
    OperatorName: "Spandana Rural And Urban Development Organisation",
  },
  {
    OperatorCode: "CareIndLR",
    OperatorName: "Care India Finvest Limited",
  },
  {
    OperatorCode: "NABFINSLR",
    OperatorName: "NABFINS",
  },
  {
    OperatorCode: "EKAGFIN",
    OperatorName: "Ekagrata Finance",
  },
  {
    OperatorCode: "APACFINLR",
    OperatorName: "APAC Financial Services Pvt Ltd",
  },
  {
    OperatorCode: "IND10915",
    OperatorName: "ICICI BANK - Interest Repayment Loans",
  },
  {
    OperatorCode: "IND10917",
    OperatorName: "Shine Blue Hire Purchase Ltd.",
  },
  {
    OperatorCode: "IND10918",
    OperatorName: "Dev Finance",
  },
  {
    OperatorCode: "IND10919",
    OperatorName: "Bussan Auto Finance India Pvt Ltd",
  },
  {
    OperatorCode: "IND10921",
    OperatorName: "Fortune Credit Capital Limited",
  },
  {
    OperatorCode: "IND10922",
    OperatorName: "CNH Industrial Capital Pvt. Ltd.",
  },
  {
    OperatorCode: "IND10923",
    OperatorName: "Muthoot Finance-Personal Loan",
  },
  {
    OperatorCode: "IND10936",
    OperatorName: "Kanakadurga Finance Limited - Gold Loans",
  },
  {
    OperatorCode: "IND10938",
    OperatorName: "KREDITBEE",
  },
  {
    OperatorCode: "IND10942",
    OperatorName: "STREE NIDHI - TELANGANA",
  },
  {
    OperatorCode: "IND10946",
    OperatorName: "Cholamandalam Investment and Finance Company Limited",
  },
  {
    OperatorCode: "IND10953",
    OperatorName: "Protium",
  },
  {
    OperatorCode: "IND10957",
    OperatorName: "Manappuram Finance Limited",
  },
  {
    OperatorCode: "IND-PUN",
    OperatorName: "We Pay Finance Pvt Ltd",
  },
  {
    OperatorCode: "IND10971",
    OperatorName: "UGRO Capital Limited",
  },
  {
    OperatorCode: "IND10976",
    OperatorName: "R.Sen and Company Investment and Finance Pvt. Ltd.",
  },
  {
    OperatorCode: "IND10992",
    OperatorName: "Poonawalla Fincorp Ltd",
  },
  {
    OperatorCode: "IND10994",
    OperatorName: "Deccan Finance Limited",
  },
  {
    OperatorCode: "IND11000",
    OperatorName: "Ezfinanz",
  },
  {
    OperatorCode: "IND11029",
    OperatorName: "Ashv Finance",
  },
  {
    OperatorCode: "IND11030",
    OperatorName: "Bishwanath Industries Limited",
  },
  {
    OperatorCode: "IND11031",
    OperatorName: "Load Krishna Financial Services Limited",
  },
  {
    OperatorCode: "IND11037",
    OperatorName: "Unity Small Finance Bank Limited",
  },
  {
    OperatorCode: "IND11038",
    OperatorName: "Vastu Finserve India Private Limited",
  },
  {
    OperatorCode: "IND11061",
    OperatorName: "Credit One Payments Solutions Pvt Ltd",
  },
  {
    OperatorCode: "IND11063",
    OperatorName: "Kusalava Finance Limited",
  },
  {
    OperatorCode: "IND11070",
    OperatorName: "Dhansansar Nidhi Limited",
  },
  {
    OperatorCode: "IND11071",
    OperatorName: "Fortune Integrated Assets Finance Ltd",
  },
  {
    OperatorCode: "IND11073",
    OperatorName: "Muthoot Money - Gold Loan",
  },
  {
    OperatorCode: "IND11078",
    OperatorName: "Swara Fincare Limited",
  },
  {
    OperatorCode: "IND11081",
    OperatorName: "Unnayan Bharat Finance Corporation Private Limited",
  },
  {
    OperatorCode: "IND11082",
    OperatorName: "Capital India Home Loans Limited",
  },
  {
    OperatorCode: "IND11103",
    OperatorName: "Ramaiah Capital Pvt Ltd",
  },
  {
    OperatorCode: "IND11106",
    OperatorName: "ARTH",
  },
  {
    OperatorCode: "IND11135",
    OperatorName: "Agriwise Finserv Limited",
  },
  {
    OperatorCode: "IND11141",
    OperatorName: "Hinduja Housing Finance Limited",
  },
  {
    OperatorCode: "IND11142",
    OperatorName: "IIFL Samasta Finance Ltd - Retail Loans",
  },
  {
    OperatorCode: "IND11145",
    OperatorName: "SBFC Finance Private Limited",
  },
  {
    OperatorCode: "IND11146",
    OperatorName: "Sonata Finance",
  },
  {
    OperatorCode: "IND11177",
    OperatorName: "Emgee Muthoot Nidhi Ltd",
  },
  {
    OperatorCode: "IND11185",
    OperatorName: "Geo Bros Muthoot Nidhi Ltd",
  },
  {
    OperatorCode: "IND11187",
    OperatorName: "LOANFRONT",
  },
  {
    OperatorCode: "IND11197",
    OperatorName: "Saraswat Bank - Loan Repayment",
  },
  {
    OperatorCode: "IND11205",
    OperatorName: "Credit Saison",
  },
  {
    OperatorCode: "IND11223",
    OperatorName: "Ambit Finvest Pvt Ltd",
  },
  {
    OperatorCode: "IND11227",
    OperatorName: "Kogta Financial India Limited",
  },
  {
    OperatorCode: "IND11233",
    OperatorName: "Manappuram Home Finance Ltd",
  },
  {
    OperatorCode: "IND11234",
    OperatorName: "Muthoot Vehicle And Asset Finance Limited",
  },
  {
    OperatorCode: "IND11237",
    OperatorName: "Setia Auto Finance Pvt Ltd",
  },
  {
    OperatorCode: "IND11249",
    OperatorName: "Fedbank Financial Services Limited",
  },
  {
    OperatorCode: "IND11252",
    OperatorName: "Hinduja Leyland Finance",
  },
  {
    OperatorCode: "IND11255",
    OperatorName: "Ring",
  },
  {
    OperatorCode: "IND11259",
    OperatorName: "Paisabuddy Finance Pvt Ltd",
  },
  {
    OperatorCode: "IND11274",
    OperatorName: "Yes Bank Ltd - Loan Payment",
  },
  {
    OperatorCode: "IND11275",
    OperatorName: "Mahindra Finance Consumer Loans",
  },
  {
    OperatorCode: "IND11284",
    OperatorName: "CASHe",
  },
  {
    OperatorCode: "IND11291",
    OperatorName: "Hero Housing Finance Ltd",
  },
  {
    OperatorCode: "IND11295",
    OperatorName: "Repco Home Finance Ltd.",
  },
  {
    OperatorCode: "IND11296",
    OperatorName: "Wonder Home Finance Limited",
  },
  {
    OperatorCode: "IND11318",
    OperatorName: "Aris Capital Pvt Limited",
  },
  {
    OperatorCode: "IND11329",
    OperatorName: "Unimoni Financial Services Ltd",
  },
  {
    OperatorCode: "IND11330",
    OperatorName: "Veritas Finance",
  },
  {
    OperatorCode: "IND11336",
    OperatorName: "Shalibhadra Finance Limited",
  },
  {
    OperatorCode: "IND11339",
    OperatorName: "The Kurla Nagarik Sahakari Bank Ltd",
  },
  {
    OperatorCode: "IND11340",
    OperatorName: "Utkarsh Bank Loan Repayment",
  },
  {
    OperatorCode: "IND11348",
    OperatorName: "Capital Trust Limited",
  },
  {
    OperatorCode: "IND11349",
    OperatorName: "Cashtree Finance",
  },
  {
    OperatorCode: "IND11353",
    OperatorName: "Hedge Finance Ltd",
  },
  {
    OperatorCode: "IND11363",
    OperatorName: "Maitreya Capital and Business Services Private Limited",
  },
  {
    OperatorCode: "IND11364",
    OperatorName: "Namdev Finvest Pvt Ltd",
  },
  {
    OperatorCode: "IND11372",
    OperatorName: "Loanzen Finance Pvt Ltd",
  },
  {
    OperatorCode: "IND11376",
    OperatorName: "Samrat Motor Finance Ltd",
  },
  {
    OperatorCode: "IND11384",
    OperatorName: "Satya MicroCapital Ltd",
  },
  {
    OperatorCode: "IND11385",
    OperatorName: "EDC Limited",
  },
  {
    OperatorCode: "IND11388",
    OperatorName: "Laxmi India Finleasecap Private Limited",
  },
  {
    OperatorCode: "IND11390",
    OperatorName: "Piramal Finance",
  },
  {
    OperatorCode: "IND11393",
    OperatorName: "Credin",
  },
  {
    OperatorCode: "IND11407",
    OperatorName: "Karpagam Hire Purchase And Finance Pvt Ltd",
  },
  {
    OperatorCode: "IND11412",
    OperatorName: "VFS Capital Limited",
  },
  {
    OperatorCode: "IND11416",
    OperatorName: "Alfastar India Nidhi Limited",
  },
  {
    OperatorCode: "IND11420",
    OperatorName: "Arman Financial Services Limited",
  },
  {
    OperatorCode: "IND11422",
    OperatorName: "Avanti Finance Private Limited",
  },
  {
    OperatorCode: "IND11438",
    OperatorName: "Esco Elettil Nidhi Limited",
  },
  {
    OperatorCode: "IND11440",
    OperatorName: "Fasttrack Housing Finance Ltd",
  },
  {
    OperatorCode: "IND11458",
    OperatorName: "Keertana Finserv Private Limited",
  },
  {
    OperatorCode: "IND11463",
    OperatorName: "Mangal Credit and Fincorp Limited",
  },
  {
    OperatorCode: "IND11467",
    OperatorName: "Namra Finance Ltd",
  },
  {
    OperatorCode: "IND11472",
    OperatorName: "Pahal Finance IL/SL",
  },
  {
    OperatorCode: "IND11482",
    OperatorName: "Sewa Grih Rin Limited",
  },
  {
    OperatorCode: "IND11488",
    OperatorName: "Speel Finance Company Private Limited (Pocketly)",
  },
  {
    OperatorCode: "IND11501",
    OperatorName: "121 Finance Private Limited",
  },
  {
    OperatorCode: "IND11504",
    OperatorName: "Andhra Pragathi Grameena Bank Loan Repayment",
  },
  {
    OperatorCode: "IND11508",
    OperatorName: "Goldline Finance Private Limited (Capital Now)",
  },
  {
    OperatorCode: "IND11511",
    OperatorName: "Muthoot Vehicle And Asset Finance Limited Gold Loan",
  },
  {
    OperatorCode: "IND11530",
    OperatorName: "Ajeevak Nidhi Limited",
  },
  {
    OperatorCode: "IND11538",
    OperatorName: "Axis Bank Limited-Digital Loan",
  },
  {
    OperatorCode: "IND11552",
    OperatorName: "Rahimatpur Sahakari Bank Ltd",
  },
  {
    OperatorCode: "IND11554",
    OperatorName: "Amarpadma Credits Pvt Ltd",
  },
  {
    OperatorCode: "IND11555",
    OperatorName: "Arthmate Financing India Private Limited",
  },
  {
    OperatorCode: "IND11565",
    OperatorName: "Rajasthan Mahila Nidhi",
  },

  {
    OperatorCode: "CREDITCARD",
    OperatorName: "CREDIT CARD",
  },
  {
    OperatorCode: "IND11149",
    OperatorName: "Kotak Mahindra Bank Credit Card",
  },
  {
    OperatorCode: "EGAOA",
    OperatorName: "Ebony Greens Apartments Owners Association",
  },
  {
    OperatorCode: "SP1",
    OperatorName:
      "SAFAL PARISAR 1 ( PARISAR CO OPERATIVE HOUSING SERVICE SOCIETY LIMITED VIBHAG - 1)",
  },
  {
    OperatorCode: "JNVB2OWA",
    OperatorName: "Janapriya Nile Valley Block 2A Owners Welfare Association",
  },
  {
    OperatorCode: "KAN3COHSL",
    OperatorName: "Kamala Ashish No 3 Co Operative Housing Society Limited",
  },
  {
    OperatorCode: "SHCOHSSLM-B",
    OperatorName:
      "Sterling Heights Co Operative Housing Service Society Ltd M - Building",
  },
  {
    OperatorCode: "AGHCHSL",
    OperatorName: "Amrut Ganga H1 Cooperative Hsg. Soc. Ltd.",
  },
  {
    OperatorCode: "PBCOHSL",
    OperatorName: "Parkwoods B1 Co Operative Housing Soc Ltd",
  },
  {
    OperatorCode: "ARWS",
    OperatorName: "Avalon Residency Welfare Society",
  },
  {
    OperatorCode: "DRCOHS",
    OperatorName: "Darshan Ricco Co Operative Housing Society",
  },
  {
    OperatorCode: "JTPHBS",
    OperatorName: "JNC The Park Home Buyers Society",
  },
  {
    OperatorCode: "VCOHSL",
    OperatorName: "Viviana Co Operative Housing Society Limited",
  },
  {
    OperatorCode: "ARCW",
    OperatorName: "Abhushan Residency C Wing",
  },
  {
    OperatorCode: "VCOHSLCF",
    OperatorName: "Viviana Co Op Hsg Soc Ltd Cultural Forum",
  },
  {
    OperatorCode: "THBFCGHSL",
    OperatorName:
      "The Hans Bhawan Friends Cooperative Group Housing Society Limited",
  },
  {
    OperatorCode: "PCPICOH",
    OperatorName: "Pristine City Phase I Co Opertive Housing",
  },
  {
    OperatorCode: "LMOWS4P",
    OperatorName: "Lodha Meridian Owners Welfare Society 4Th Phase",
  },
  {
    OperatorCode: "AoAOOSCC",
    OperatorName: "Association of Apartment Owners Of Star Court Cluster",
  },
  {
    OperatorCode: "IND-HAR-Gurgaon",
    OperatorName: "Mayfield Gardens RWA C Block",
  },
  {
    OperatorCode: "IND-HAR-Gurgaon",
    OperatorName: "Trinity Towers Condominium Association",
  },
  {
    OperatorCode: "IND10997",
    OperatorName: "Exotica Condominium Owners Association",
  },
  {
    OperatorCode: "IND11184",
    OperatorName: "Infinity Co-operative Housing Society Ltd",
  },
  {
    OperatorCode: "IND11264",
    OperatorName: "Falguni Residency",
  },
  {
    OperatorCode: "IND11289",
    OperatorName: "Surya Vaibhav Co Operative Housing Society Ltd",
  },
  {
    OperatorCode: "IND11300",
    OperatorName: "Harventures Farming And Housing Projects Private Limited",
  },
  {
    OperatorCode: "IND11302",
    OperatorName: "Devbhoomi Bunglows Owners Association",
  },
  {
    OperatorCode: "IND11324",
    OperatorName: "Ratna Heaven Co Operative  Housing Service Society",
  },
  {
    OperatorCode: "IND11333",
    OperatorName: "Kamalvilla Co Op Housing Society Ltd",
  },
  {
    OperatorCode: "IND11337",
    OperatorName: "Suman Sarthi Building C Co Housing Society",
  },
  {
    OperatorCode: "IND11345",
    OperatorName: "Abvaa Avenue E Tower",
  },
  {
    OperatorCode: "IND11355",
    OperatorName: "Jalvayu Tower Housing Society Resident Welfare Association",
  },
  {
    OperatorCode: "IND11356",
    OperatorName: "Shivansh Sharnan Shop Association",
  },
  {
    OperatorCode: "IND11375",
    OperatorName: "Orchid Homes Flat Owners Sahakari Grihanirman Sanstha",
  },
  {
    OperatorCode: "IND11378",
    OperatorName: "Siddharth Enclave Apartment Towers Association",
  },
  {
    OperatorCode: "IND11386",
    OperatorName: "Nuremohammadi Co Op Hsng Sah Mandl Ltd",
  },
  {
    OperatorCode: "IND11387",
    OperatorName: "Rudra Tower Residents Welfare Association Varanasi",
  },
  {
    OperatorCode: "IND11391",
    OperatorName: "Regency Park Flat Owners Co Operative Society",
  },
  {
    OperatorCode: "IND11394",
    OperatorName: "Empire Square IJ Wing CHS",
  },
  {
    OperatorCode: "IND11419",
    OperatorName: "Appayan Assosiation Of Apartment Owners",
  },
  {
    OperatorCode: "IND11442",
    OperatorName: "Goodwill Metropolis West Phase 2 CO OP HGS SOC LTD",
  },
  {
    OperatorCode: "IND11460",
    OperatorName: "Kshitij Residency Sahakari Gruhrachana Sanstha Maryadit",
  },
  {
    OperatorCode: "IND11469",
    OperatorName: "Nikunjam Tower Owners Association",
  },
  {
    OperatorCode: "IND11471",
    OperatorName: "Om Shri Opulence Residents Welfare Association",
  },
  {
    OperatorCode: "IND11484",
    OperatorName: "Shiv Leela Sahaakari Gruhnirman Sanstha Maryadit",
  },
  {
    OperatorCode: "IND11490",
    OperatorName: "Sun Exotica C Wing Co-operative Housing Society Ltd",
  },
  {
    OperatorCode: "IND11494",
    OperatorName: "The New Cochin Residents Association",
  },
  {
    OperatorCode: "IND11551",
    OperatorName: "Proptension India Pvt Ltd",
  },
  {
    OperatorCode: "BAaRPL",
    OperatorName: "B.K. Arogyam and Research Pvt. Ltd",
  },
  {
    OperatorCode: "BHPL",
    OperatorName: "Billroth Hospitals Pvt Ltd",
  },
  {
    OperatorCode: "IND11261",
    OperatorName: "Caritas Hospital",
  },
  {
    OperatorCode: "IND11305",
    OperatorName: "Metro Hospital And Trauma Centre",
  },
  {
    OperatorCode: "IND11307",
    OperatorName: "Jaipur Ayrveda Hospital Abu Road",
  },
  {
    OperatorCode: "IND11308",
    OperatorName: "Blossoms Smile Health Care LLP Vijayawada",
  },
  {
    OperatorCode: "IND11371",
    OperatorName: "Stature Life Sciences Pvt Ltd",
  },
  {
    OperatorCode: "IND11395",
    OperatorName: "Shree Diagnostics",
  },
  {
    OperatorCode: "IND11410",
    OperatorName: "Rathi Med Speciality Hospital",
  },
  {
    OperatorCode: "IND11432",
    OperatorName: "Dasmesh Healthcare Hospital",
  },
  {
    OperatorCode: "IND11510",
    OperatorName: "Maa Kaamal Medical Center",
  },
  {
    OperatorCode: "IND11543",
    OperatorName: "Lifeline Multi Specialty Hospitals Pvt Ltd",
  },
  {
    OperatorCode: "HTD",
    OperatorName: "HT Digital",
  },
  {
    OperatorCode: "F",
    OperatorName: "Furlenco",
  },
  {
    OperatorCode: "ZEEL",
    OperatorName: "Zee Entertainment Enterprises Limited",
  },
  {
    OperatorCode: "F",
    OperatorName: "FITPASS",
  },
  {
    OperatorCode: "N-EBSPL",
    OperatorName: "Nupay - Entellus Business Solutions Pvt Ltd",
  },
  {
    OperatorCode: "SHEMSB",
    OperatorName: "Shemaroo -IBADAT",
  },
  {
    OperatorCode: "SHEMESB",
    OperatorName: "Shemaroo Entertainment -Bhakti",
  },
  {
    OperatorCode: "IND10911",
    OperatorName: "Hindustan Times media ltd",
  },
  {
    OperatorCode: "IND10945",
    OperatorName: "Bajaj Finserv Health Limited",
  },
  {
    OperatorCode: "IND10948",
    OperatorName: "Hungama Play",
  },
  {
    OperatorCode: "IND10949",
    OperatorName: "Hungama Music",
  },
  {
    OperatorCode: "IND11022",
    OperatorName: "Jyoshith Jewellers",
  },
  {
    OperatorCode: "IND11026",
    OperatorName: "Sree Bharat Labs",
  },
  {
    OperatorCode: "IND11028",
    OperatorName: "Ashok Book Centre",
  },
  {
    OperatorCode: "IND11033",
    OperatorName: "MediBuddy",
  },
  {
    OperatorCode: "IND11074",
    OperatorName: "MyUpchar",
  },
  {
    OperatorCode: "IND11083",
    OperatorName: "Manashakti Rest New Way",
  },
  {
    OperatorCode: "IND11085",
    OperatorName: "The Indian Express",
  },
  {
    OperatorCode: "IND11105",
    OperatorName: "BYJUS",
  },
  {
    OperatorCode: "IND11183",
    OperatorName: "SonyLIV",
  },
  {
    OperatorCode: "IND11203",
    OperatorName: "APOLLO 24|7",
  },
  {
    OperatorCode: "IND11241",
    OperatorName: "Hoichoi",
  },
  {
    OperatorCode: "IND11245",
    OperatorName: "Pocket FM",
  },
  {
    OperatorCode: "IND11303",
    OperatorName: "Primeflix Pvt Ltd",
  },
  {
    OperatorCode: "IND11399",
    OperatorName: "Wynk Music",
  },
  {
    OperatorCode: "IND11433",
    OperatorName: "DDD Advance Boxing Association",
  },
  {
    OperatorCode: "IND11497",
    OperatorName: "Urmi Yoga Academy",
  },
  {
    OperatorCode: "IND11563",
    OperatorName: "Prasann Yog",
  },
  {
    OperatorCode: "MPCOCAI",
    OperatorName: "Madhya Pradesh Chamber Of Commerce And Industry",
  },
  {
    OperatorCode: "IND11023",
    OperatorName: "Naval Officers Institute",
  },
  {
    OperatorCode: "IND11065",
    OperatorName: "Association of National Exchanges Members of India",
  },
  {
    OperatorCode: "IND11312",
    OperatorName: "St Pauls Club",
  },
  {
    OperatorCode: "IND11327",
    OperatorName: "Sri Rama Buddha Welfare Association Madhurawada",
  },
  {
    OperatorCode: "IND11342",
    OperatorName: "Youth Club Bejjipuram Ranasthalam",
  },
  {
    OperatorCode: "IND11350",
    OperatorName: "Friends Arts And Sports Club",
  },
  {
    OperatorCode: "IND11369",
    OperatorName: "Spring Valley Owners Association Vellore",
  },
  {
    OperatorCode: "IND11396",
    OperatorName: "Central University Of Tamil Nadu Alumni Association",
  },
  {
    OperatorCode: "IND11474",
    OperatorName: "Radheshyam Apartment Owners Welfare Association Vijayawada",
  },
  {
    OperatorCode: "IND11561",
    OperatorName: "MBC Connect Pvt Ltd",
  },
  {
    OperatorCode: "MPU(-PT",
    OperatorName: "Madhya Pradesh Urban (e-Nagarpalika) - Property Tax",
  },
  {
    OperatorCode: "HMC",
    OperatorName: "Hubli-Dharwad Municipal Corporation",
  },
  {
    OperatorCode: "PNN",
    OperatorName: "Prayagraj Nagar Nigam",
  },
  {
    OperatorCode: "KDMC1",
    OperatorName: "Kalyan Dombivali Municipal Corporation",
  },
  {
    OperatorCode: "VVMC-P",
    OperatorName: "Vasai Virar Municipal Corporation - Property",
  },
  {
    OperatorCode: "SCC",
    OperatorName: "Shivamogga City Corporation",
  },
  {
    OperatorCode: "GCC",
    OperatorName: "Greater Chennai Corporation",
  },
  {
    OperatorCode: "MC-M",
    OperatorName: "Minicipal Corporation - Meerut",
  },
  {
    OperatorCode: "NNA",
    OperatorName: "Nagar Nigam Agra",
  },
  {
    OperatorCode: "NPPL",
    OperatorName: "Nagar Palika Parishad Lalitpur",
  },
  {
    OperatorCode: "MCR",
    OperatorName: "Municipal Corporation Rohtak",
  },
  {
    OperatorCode: "RMC",
    OperatorName: "Rajkot Municipal Corporation",
  },
  {
    OperatorCode: "PUDUUTMT",
    OperatorName: "Puducherry UT (Local Bodies) -Property Tax",
  },
  {
    OperatorCode: "CCPANMT",
    OperatorName: "Corporation of City Panaji",
  },
  {
    OperatorCode: "MMCMT",
    OperatorName: "Margao Municipal Council",
  },
  {
    OperatorCode: "MHMCMT",
    OperatorName: "Mhapsa Municipal Council",
  },
  {
    OperatorCode: "IND-GOA-South_Goa",
    OperatorName: "Mormugao Municipal Council",
  },
  {
    OperatorCode: "PMCMT",
    OperatorName: "Ponda Municipal Council",
  },
  {
    OperatorCode: "SANMCMT",
    OperatorName: "Sankhali Municipal council",
  },
  {
    OperatorCode: "IND-GOA-North_Goa",
    OperatorName: "Pernem Municipal council",
  },
  {
    OperatorCode: "IND-GOA-North_Goa",
    OperatorName: "Valpoi Municipal council",
  },
  {
    OperatorCode: "IND-GOA-South_Goa",
    OperatorName: "Quepem Municipal council",
  },
  {
    OperatorCode: "BICMCMT",
    OperatorName: "Bicholim Municipal council",
  },
  {
    OperatorCode: "CCMCMT",
    OperatorName: "Curchorem Cacora Municipal council",
  },
  {
    OperatorCode: "MCSHIMMT",
    OperatorName: "Municipal Corporation Shimla",
  },
  {
    OperatorCode: "UDDUTMT",
    OperatorName: "UDD Uttarakhand",
  },
  {
    OperatorCode: "GULCC",
    OperatorName: "Gulbarga City Corporation",
  },
  {
    OperatorCode: "CUNCMCMT",
    OperatorName: "Cuncolim Municipal council",
  },
  {
    OperatorCode: "SANGMCMT",
    OperatorName: "Sanguem Municipal council",
  },
  {
    OperatorCode: "CANMCMT",
    OperatorName: "Canacona Municipal council",
  },
  {
    OperatorCode: "NNMVMT",
    OperatorName: "Nagar Nigam Mathura-Vrindavan",
  },
  {
    OperatorCode: "IND-UTP-Kheri",
    OperatorName: "Nagar Palika Palia Kalan",
  },
  {
    OperatorCode: "IND-MAH",
    OperatorName: "MCGM Property Tax",
  },
  {
    OperatorCode: "IND-MAH-Pune",
    OperatorName: "Jejuri Nagarparishad",
  },
  {
    OperatorCode: "IND-MAH",
    OperatorName: "Mira Bhayander Municipal Corporation",
  },
  {
    OperatorCode: "IND10991",
    OperatorName: "Nagar Palika Parishad - Sitapur",
  },
  {
    OperatorCode: "IND10999",
    OperatorName: "Kolhapur Municipal corporation- Property tax",
  },
  {
    OperatorCode: "IND11084",
    OperatorName: "Siliguri Jalpaiguri Development Authority",
  },
  {
    OperatorCode: "IND11195",
    OperatorName: "Municipal Corporation Bhopal",
  },
  {
    OperatorCode: "IND11198",
    OperatorName:
      "Talegaon Dabhade Nagar Parishad - Municipal Taxes and Services Payments",
  },
  {
    OperatorCode: "IND11240",
    OperatorName: "Greater Hyderabad Municipal Corporation",
  },
  {
    OperatorCode: "IND11268",
    OperatorName: "Kolkata Municipal Corporation",
  },
  {
    OperatorCode: "IND11320",
    OperatorName: "Municipal Corporation Of The City Of Chandrapur",
  },
  {
    OperatorCode: "IND11358",
    OperatorName: "Varanasi Nagar Nigam Property Tax",
  },
  {
    OperatorCode: "IND11392",
    OperatorName:
      "Commissioner and Director of Municipal Administration Hyderabad, Telangana",
  },
  {
    OperatorCode: "IND11444",
    OperatorName: "Gram Panchayat Dhamner",
  },
  {
    OperatorCode: "IND11445",
    OperatorName: "GRAM PANCHAYAT WANGI",
  },
  {
    OperatorCode: "IND11450",
    OperatorName: "GRAMPANCHAYAT NEVARI",
  },
  {
    OperatorCode: "IND11451",
    OperatorName: "Grampanchayat Kheradewangi",
  },
  {
    OperatorCode: "IND11452",
    OperatorName: "Grampanchayat Ambegaon",
  },
  {
    OperatorCode: "IND11454",
    OperatorName: "Grampanchayat Hingangaon Budruk",
  },
  {
    OperatorCode: "IND11475",
    OperatorName: "Raha Municipal Corporation",
  },
  {
    OperatorCode: "IND11491",
    OperatorName: "Tamil Nadu Civil Supplies And Customer Protection Dept",
  },
  {
    OperatorCode: "IND11493",
    OperatorName: "Tarapith Rampurhat Development Authority(TRDA)",
  },
  {
    OperatorCode: "IND11498",
    OperatorName: "Vadodara Municipal Corporation Property Tax",
  },
  {
    OperatorCode: "IND11535",
    OperatorName: "Vadiyeraibag Grampanchayat",
  },
  {
    OperatorCode: "IND11546",
    OperatorName: "Patna Municipal Corporation",
  },
  {
    OperatorCode: "PBMC",
    OperatorName: "Port Blair Municipal Council",
  },
  {
    OperatorCode: "IND-KAR",
    OperatorName: "Directorate of Municipal Administration Karnataka",
  },
  {
    OperatorCode: "IND11301",
    OperatorName: "Grampanchayat Halondi Gram Nidhi",
  },
  {
    OperatorCode: "IND11315",
    OperatorName: "Nagar Palika Jaitaran",
  },
  {
    OperatorCode: "IND11459",
    OperatorName: "Kolkata Municipal Corporation-Trade license",
  },
  {
    OperatorCode: "PGC",
    OperatorName: "Bharat Gas (BPCL)",
  },
  {
    OperatorCode: "HGC",
    OperatorName: "HP Gas (HPCL)",
  },
  {
    OperatorCode: "IGIOL",
    OperatorName: "Indane Gas (Indian Oil)",
  },
];

module.exports = operatorList;
