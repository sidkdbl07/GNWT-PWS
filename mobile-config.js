App.info({
  name: 'Inspect',
  description: 'An application for building inspections developed by AE for GNWT PWS',
  version: '0.1.20160314v1'
});

App.icons({
  'android_ldpi': 'resources/icons/icon-ldpi.png',
  'android_mdpi': 'resources/icons/icon-mdpi.png',
  'android_hdpi': 'resources/icons/icon-hdpi.png',
  'android_xhdpi': 'resources/icons/icon-xhdpi.png'
});

App.launchScreens({
  'android_ldpi_portrait': 'resources/launch/ldpi-portrait.png',
  'android_ldpi_landscape': 'resources/launch/ldpi-landscape.png',
  'android_mdpi_portrait': 'resources/launch/mdpi-portrait.png',
  'android_mdpi_landscape': 'resources/launch/mdpi-landscape.png',
  'android_hdpi_portrait': 'resources/launch/hdpi-portrait.png',
  'android_hdpi_landscape': 'resources/launch/hdpi-landscape.png',
  'android_xhdpi_portrait': 'resources/launch/xhdpi-portrait.png',
  'android_xhdpi_landscape': 'resources/launch/xhdpi-landscape.png'
});

App.accessRule("*");
