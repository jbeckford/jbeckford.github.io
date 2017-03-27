$(function() {
  var thumbNailHtmlTemplate = detatchThumbNailHtmlTemplate();
  var videoProviderFilterContainerTemplate =  detatchVideoProviderFilterContainerTemplate();
   // var providerHtmlTemplate = detatchProviderHtmlTemplate();
  var userVideoProviders = getVideoProviders();
  var shouldShowVideoProvider = {};
  subscribeToSearchTermChangedEvent();
  subscribeToSubmitEvent();
  for(var userVideoProviderIndex = 0; userVideoProviderIndex < userVideoProviders.length; userVideoProviderIndex++){
    var userVideoProvider = userVideoProviders[userVideoProviderIndex];
    addVideoProviderFilter(userVideoProvider.providerName);
  }

  subscribeToVideoProviderFilterControlChanges();

  filterMovies();

  function subscribeToVideoProviderFilterControlChanges(){
    $(getVideoProviderFilterControlClassSelector()).change(handleVideoProviderFilterControlChange);
  }

  function handleVideoProviderFilterControlChange(){
    var providerName = getVideoProviderName($(this).attr("id"));
    shouldShowVideoProvider[providerName] = !shouldShowVideoProvider[providerName];
    filterVideosByProvider(providerName, shouldShowVideoProvider[providerName]);
  }

  function detatchThumbNailHtmlTemplate() {
    var thumbNailHtmlTemplate = $(".thumb").clone();
    removeThumbNailHtmlTemplate();
    return thumbNailHtmlTemplate;
  }

  function removeThumbNailHtmlTemplate() {
    $(".thumb").remove();
  }

  function detatchProviderHtmlTemplate() {
    providerHtmlTemplate = $(getProviderHtmlTemplateClassName()).clone();
    removeProviderHtmlTemplate();
    return providerHtmlTemplate;
  }

  function removeProviderHtmlTemplate() {
    $(getProviderHtmlTemplateClassName()).remove();
  }

  function getProviderHtmlTemplateClassName(){
    return ".providerContainer";
  }

  function detatchVideoProviderFilterContainerTemplate() {
    var videoProviderFilterContainerTemplates = $(getVideoProviderFilterContainerClassSelector());
    var videoProviderFilterContainerTemplate = videoProviderFilterContainerTemplates.clone();
    removeVideoProviderFilterContainerTemplate();
    return videoProviderFilterContainerTemplate;
  }

  function removeVideoProviderFilterContainerTemplate() {
    $(getVideoProviderFilterContainerClassSelector()).remove();
  }

  function addVideoProviderFilter(videoProviderName){
    createVideoProviderFilterContainer(videoProviderName).appendTo(getVideoProviderFiltersContainerSelector());
  }

  function createVideoProviderFilterContainer(videoProviderName) {
    var videoProviderFilterContainer = videoProviderFilterContainerTemplate.clone();
    var foo = videoProviderFilterContainerTemplate.clone();
    // videoProviderFilterContainer.attr("id", getVideoProviderId(videoProviderName));
    var videoProviderFilter = videoProviderFilterContainer.children(0);
    videoProviderFilter.html(getVideoProviderNameHtml(videoProviderName));
    videoProviderFilter.attr("id", getVideoProviderId(videoProviderName));
    videoProviderFilter.addClass(getVideoProviderFilterControlClassName());
    shouldShowVideoProvider[videoProviderName] = true;
    return videoProviderFilterContainer;
  }

  function getVideoProviderNameHtml(videoProviderName){
    return "<input type=\"checkbox\" value=\"\" checked>" + videoProviderName;
  }

  function getVideoProviderId(videoProviderName){
    return getVideoProviderIdPrefix() + videoProviderName;
  }

  function getVideoProviderName(videoProviderId){
    return videoProviderId.substring(getVideoProviderIdPrefix().length, videoProviderId.length);
  }

  function getVideoProviderFilterControlClassSelector(){
    return "." + getVideoProviderFilterControlClassName();
  }

  function getVideoProviderFilterControlClassName(){
    return "videoProviderFilter";
  }

  function getVideoProviderIdPrefix(){
    return "videoProvider_";
  }

  function getVideoProviderFiltersContainerSelector(){
    return "#videoProviderFilterContainers";
  }

  function getVideoProviderFilterContainerClassSelector() {
    return "." + getVideoProviderFilterContainerClassName();
  }

  function getVideoProviderFilterContainerClassName() {
    return "videoProviderFilterContainer";
  }


  function subscribeToSearchTermChangedEvent(){
    // Use $.on(submit) or $.click to figure out when the user clicks the "submit" button
    $("#searchTerm").on("input", handleSearchTermChanged);
  }

  function handleSearchTermChanged(){
    filterMovies();
  }

  function subscribeToSubmitEvent(){
    // Use $.on(submit) or $.click to figure out when the user clicks the "submit" button
    $("#formSearchMovies").submit(handleSubmit);
  }

  function handleSubmit(){
    // Prevent a form submission using the event.preventDefault() functionUse the $.ready() handler to delay your code from executing until all DOM assets have been loaded
    event.preventDefault();
    filterMovies();
  }

  function filterMovies() {
    var searchTerm = getSearchTerm(); 
    // findAndDisplayMovies(searchTerm);
    findAndDisplayMovies2(userVideoProviders, searchTerm);
  }

  function getSearchTerm(){
    var searchTerm = $("#searchTerm").val();
    var searchTermWithoutSpaces = searchTerm.replace(" ","");
    return searchTermWithoutSpaces;
  }

  function getThumbNailContainer(){
    return $("#thumbNailsContainer.row");
  }

  function getThumbNailsContainerSelector(){
    return "#thumbNailsContainer";
  }

  function findAndDisplayMovies2(videoProviders, moviesSearchTerm){
    clearImages();

    for (var videoProviderIndex = 0; videoProviderIndex < videoProviders.length; videoProviderIndex++){
      var videoProvider = videoProviders[videoProviderIndex];
      var foundVideos = videoProvider.findVideos(moviesSearchTerm);

      // for(var videoIdIndex = 0; videoIdIndex < videoIds.length; videoIdIndex++){
      //   var videoProvidersMap = videosMap[videoIds[videoIdIndex]];

      //   if (!videosMap.hasOwnProperty(videoIds[videoIdIndex]))
      //   {
      //     videoProvidersMap = new Object();
      //     videosMap[videoIds[videoIdIndex]] = videoProvidersMap;
      //   }

      //   videoProvidersMap[videoProvider.providerName] = videoProvider;
      // }
      addImages(videoProvider, foundVideos);
    }
  }

  function addImages(videoProvider, videoNames){
    for(var videoIndex = 0; videoIndex < videoNames.length; videoIndex++){
      addImage(videoProvider, videoNames[videoIndex]);
    }
  }

  function addImage(videoProvider, videoName){
    var thumbNailContainer = getThumbNailContainer(videoProvider.providerName, videoName);
    thumbNailContainer.appendTo(getThumbNailsContainerSelector());
  }

  function getThumbNailContainer(videoProviderName, imageId){
    thumbNailContainer = thumbNailHtmlTemplate.clone();
    thumbNailContainer.attr("id", "imageId");
    thumbNailContainer.children(0).children(0).attr("src", getImagePath(videoProviderName, imageId));
    thumbNailContainer.addClass(getImageClassName());
    thumbNailContainer.addClass(getVideoProviderClassName(videoProviderName));
    return thumbNailContainer;
  }

  function getImagePath(videoProviderName, imageId){
    return "images/moviesArt/" + videoProviderName + "/"+ imageId + ".jpg";
  }

  function getVideoProviderClassName(providerName){
    return providerName;
    // return "VideoProvider_" + providerName;
  }

  function getVideoProviders(){
    var videoProviders = [];
    var netflixVideos = ["AbstractTheArtOfDesign", "AmandaKnox", "AmySchumerTheLeatherSpecial", "ArrestedDevelopment", "AudrieAndDaisy", "Barry", "BillBurrWalkYourWayOut", "BlackMirror", "BloodLine", "BuddyThindersTruck", "CallMeFrancis", "CedricTheEntertainerLiveFromTheVille", "ChefsTableFrance", "ChefsTableNewEpisodes", "ChewingGum", "Cooked", "DanaCarveyStraightWhiteMale60", "FourSeasonsInHavana", "FullerHouse", "GabrielIglesiasImSorryForWhatISaidWhenIWasHungry", "GilmoreGirlsAYearInTheLife", "GraceAndFrankie", "HipHopEvolution", "HouseOfCards", "IDontFeelAtHomeAnymore", "JimGaffiganCinco", "KeithRichardsUnderTheInfluence", "LaNina", "LimenySticketsASeriesOfUnfortunateEvents", "Love", "LukeCage", "MakingAMurderer", "MarvelJessicaJones", "MasterOfNone", "MikrBirbigliaThankGodForJokes", "Narcos", "OneDayAtATime", "OrangeIsTheNewBlack", "SantaClaritaDiet", "StrangerThings", "TalesByLight", "Tallulah", "The13th", "TheCrown", "TheCubaLibreStory", "TheDoOver", "TheFundamentalsOfCaring", "TheOA", "TheRanch", "TheWhiteHelmets", "TokyoStories", "TonyRobbinsIAmNotYourGuru", "TrevorNoahAfraidOfTheDark", "UltimateBeastMaster", "UnbreakableKimmySchmidt", "WhatHappenedMissSimone", "WhiteRabbitProject", "WinterOnFireUkrainesFightForFreedom"];
    var xfinityVideos = ["10CloverFieldLane", "Allied", "Arrival", "AssassinsCreed", "BeautyAndTheBeast", "CaptainFantastic", "DoctorStrange", "FantasticBeasts", "Fences", "Frozen", "HacksawRidge", "Jackie", "JasonBourne", "JohnWayne", "Moana", "Moonlight", "NineLives", "Passengers", "Pets", "RiseUp", "Sicario", "Sing", "Split", "Storks", "TheDressMaker", "TheGirlWithAllTheGifts", "TheSpongeBobMovie", "Trolls", "XmenApocalypse"];
    var amazonVideos = ["13Hours", "Anthropoid", "BattleFieldSevastapol", "CreaturesOfTheDeepSea", "Creed", "DaddysHome", "DirtyGranpa", "Emma", "EverythingAndNothing", "GangsOfNewYork", "GhostRecon", "HappyFeet", "Hook", "HotPursuit", "IndianaJonesAndTheLastCrusade", "IndianaJonesAndTheTempleOfDoom", "IndianaJonesRaidersOfTheLostArk", "IndianJonesAndTheKingdomOfTheCrystalSkull", "Interstellar", "IntoTheWild", "IronMan", "KnightTimeTerror", "MarginCall", "MissionImpossibleRogueNation", "MisYouAlready", "MrChurch", "NineLives", "NormOfTheNorth", "Room", "SaintsAndSoldiers", "Spectre", "SwissArmyMan", "TerminatorGenisys", "TheAgeOfAdaline", "TheBoondockSaints", "TheChoice", "TheDinosaurProject", "TheDressmaker", "TheEscort", "TheGutOurSecondBrain", "TheHungerGamesMockingJay", "TheInfiltrator", "TheManInTheHighCastle", "TheSeaOfTrees", "TheSpyNextDoor", "TheSubstitute", "TheWords", "WhatWeDoInTheShadows", "WhereToInvadeNext", "WhiskeyTangoFoxtrot", "WhoGetsTheDog", "WildBill", "WillieWonkaAndTheChocolateFactory", "Zoolander"];

    videoProviders.push(new VideoProvider("Amazon", "Amazon.jpg", amazonVideos));
    videoProviders.push(new VideoProvider("Netflix", "Netflix.jpg", netflixVideos));
    videoProviders.push(new VideoProvider("Xfinity", "Xfinity", xfinityVideos));
    return videoProviders;
  }

  function VideoProvider(providerName, providerIconName, videoUniverse){
    this.providerName = providerName;
    this.providerIconName = providerIconName;
    this.videos = videoUniverse;
    this.findVideos = function(moviesSearchTerm){
      var foundMovies = [];

      var pattern = new RegExp(moviesSearchTerm, "i");

      for(var videoIndex = 0; videoIndex < this.videos.length; videoIndex++) {
        if(pattern.test(this.videos[videoIndex])){
          foundMovies.push(this.videos[videoIndex]);
        }
      }
      return foundMovies;
    };
  }

  function clearImages() {
    $(".thumb").remove();
    // $(getImageClassSelector()).remove();
  }

  function getImageClassSelector(){
    return "." + getImageClassName();
  }

  function getImageClassName(){
    return "whereToWatchImage"; 
  }

  function filterVideosByProvider(providerName, shouldDisplay){
    if(shouldDisplay){
      $("." + providerName).show(1000);
    } else {
      $("." + providerName).hide(1000);
    }
  }

});