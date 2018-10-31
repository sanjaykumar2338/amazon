var getEstimatedSales = function(Category, SalesRank,country) {
  Category = $.trim(Category);

  if (!IsNumeric(SalesRank)) {
    console.log('if IsNumeric' , 'not')
  }else{
    console.log('if IsNumeric' , 'yes')
  }


  if (!IsNumeric(SalesRank)) {
    return;
  }

  var EstimatedSales;
  if (Category == "Toys & Games") {
    Slop = -0.910196205564476;
    Offset = 63866.5924884108;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES);
    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 76;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Automotive" || Category == "Tools & Home Improvement") {
    Slop = -0.633136406198535;
    Offset = 1459.97464905557;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 63;
      Adjust = 0.65; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.65;
    else if (SalesRank < 800)
    Adjust = 0.65;
    else if (SalesRank < 1000)
    Adjust = 0.7;
    else if (SalesRank < 2000)
    Adjust = 0.7;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Home Improvements") {
    Slop = -0.892647454978935;
    Offset = 31871.6649985098;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 88;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Kitchen & Dining") {
    Slop = -1.01410732238537;
    Offset = 101201.296675844;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 98;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Home and Kitchen" || Category == "Home & Kitchen") {
    Slop = -0.829847569905984;
    Offset = 32355.1377081117;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 128;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Health & Personal Care") {
    Slop = -1.11221344800393;
    Offset = 402609.1695426;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 158;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Sports & Outdoors") {
    Slop = -0.890277344864231;
    Offset = 30790.3538325155;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 97;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Beauty" || Category == "Beauty & Personal Care"  || Category == "Health & Household" || Category == "Products") {
    Slop = -0.935079666570251;
    Offset = 44648.3295127306;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 600) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 84;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.4;
    else if (SalesRank < 800)
    Adjust = 0.4;
    else if (SalesRank < 1000)
    Adjust = 0.45;
    else if (SalesRank < 2000)
    Adjust = 0.5;
    else if (SalesRank < 4000)
    Adjust = 0.8;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Patio, Lawn & Garden") {
    Slop = -0.8687913834089;
    Offset = 12942.373575964;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 116;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Grocery & Gourmet Food") {
    Slop = -1.19433041346734;
    Offset = 579199.138930291;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 106;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Clothing") {
    Slop = -0.890301317849426;
    Offset = 50229.0970635419;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 44;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Musical Instruments") {
    Slop = -1.02683869745013;
    Offset = 15479.6763443842;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 56;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Pet Supplies") {
    Slop = -1.10627691729796;
    Offset = 154077.608501638;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 68;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Office Products") {
    Slop = -0.947430145186706;
    Offset = 31553.6757228578;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 82;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Industrial & Scientific") {
    Slop = -0.749611336516322;
    Offset = 2511.66293051382;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 41;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Arts, Craft & Sewing") {
    Slop = -0.829766707830769;
    Offset = 7819.72839867913;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 78;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Videogames") {
    Slop = -1.07764010379412;
    Offset = 18381.5268612669;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 72;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Jewelry") {
    Slop = -1.01346421616392;
    Offset = 22758.7833803613;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES);

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 43;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Baby") {
    Slop = -1.03098161074877;
    Offset = 39812.0435636674;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 82;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Cell Phones & Accessories") {
    Slop = -0.733958399561946;
    Offset = 5453.1139257706;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 85;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Home and Garden") {
    Slop = -0.537265153086811;
    Offset = 494.172227898278;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 30;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Watches") {
    Slop = -0.870661992348441;
    Offset = 2130.44370633452;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 72;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Camera & Photo") {
    Slop = -0.810813891501792;
    Offset = 1086.23732510221;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 35;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Electronics") {
    Slop = -0.58633189502591;
    Offset = 505.052282708312;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES);

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 30;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant
    
    console.log('EstimatedSales', EstimatedSales)
    console.log('Adjust', Adjust)

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Computers & Accessories") {
    Slop = -0.794057157841841;
    Offset = 1385.00773607183;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 31;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Appliances") {
    Slop = -0.861357686991442;
    Offset = 451.610316995561;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 19;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Music") {
    Slop = -0.662910080313591;
    Offset = 738.200160843942;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 45;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Movies & TV") {
    Slop = -1.01605292985309;
    Offset = 33318.4010560254;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 38;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  }else{
    Slop = -1.10627691729796;
    Offset = 154077.608501638;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 80;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    if (country == 'de' || country == 'fr' || country == 'es' || country == 'it' || country == 'uk' || country == 'ca' ||country == 'in' || country == 'jp' || country == 'mx' || country == 'com.mx')
			EstimatedSales = EstimatedSales * Adjust;
	else		
			EstimatedSales = EstimatedSales * 0.15;

  }

  return EstimatedSales;
}

var calculateSales = function(country,Category, SalesRank, Price)
{
    /**/

    console.log('country,Category, SalesRank, Price', country,Category, SalesRank, Price);

    EstimatedSales = getEstimatedSales(Category, SalesRank,country);

    console.log('EstimatedSalesEstimatedSales',EstimatedSales)

    if (country == 'de' || country == 'fr' || country == 'es' || country == 'it' || country == 'uk' || country == 'ca')
      EstimatedSales = EstimatedSales*0.41; //reduce
    if (country == 'in' || country == 'jp' || country == 'mx' || country == 'com.mx'  )
      EstimatedSales = EstimatedSales*0.15; //reduce

    var m = new Date();


	 if ((m.getMonth() + 1) == 11 || (m.getMonth() + 1) == 12) {
		EstimatedSales = EstimatedSales * 1;
	}
	else {
		EstimatedSales = EstimatedSales * 0.85;  
	}

    EstimatedSales = EstimatedSales * 30;

    console.log(EstimatedSales,'EstimatedSales');

    var EstimatedRevenue = 0.00;


    if (IsNumeric(EstimatedSales))
    {
        if (EstimatedSales < 1 && EstimatedSales>0)
        {
            var denominator = 1/EstimatedSales;
            denominator = parseInt(denominator);
            if (denominator == 1)
                denominator++;
            //console.log('denominator', denominator);
            //$(dom+'EstSales').text('1 each '+parseInt(denominator)+' months');
            EstimatedSales = '1 each '+parseInt(denominator)+' months';
        }
        else
        {
            EstimatedSales = parseInt(EstimatedSales);
            //console.log('EstimatedSales', EstimatedSales);
            //$(dom+'EstSales').text(EstimatedSales);
        }

        //var EstimatedRevenue = "";
        console.log('Price', Price)
        if(typeof(Price) != "undefined" && Price !== null) {
            
            var Price = Price.replace(",","");

            EstimatedRevenue = EstimatedSales*Price;
            //$(dom+'EstRevenue').html(getMoneySymbol()+EstimatedRevenue.format(2));
            //console.log('EstimatedRevenue', EstimatedRevenue);
        }

        console.log('EstimatedSales', EstimatedSales, EstimatedRevenue.toFixed(2));

        return [EstimatedSales, EstimatedRevenue.toFixed(2)];
    } 
};

var IsNumeric = function (input) {
    console.log(input,'input')
    if($.isNumeric(input)){
        return true;
    }

    return false;
    
    //var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    //return (RE.test(input));
}