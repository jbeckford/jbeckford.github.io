$(function() {
  var imageIndex = 0;
  var imageIds = ["AbstractTheArtOfDesign", "AmandaKnox", "AmySchumerTheLeatherSpecial", "ArrestedDevelopment", "AudrieAndDaisy", "Barry", "BillBurrWalkYourWayOut", "BlackMirror", "BloodLine", "BuddyThindersTruck", "CallMeFrancis", "CedricTheEntertainerLiveFromTheVille", "ChefsTableFrance", "ChefsTableNewEpisodes", "ChewingGum", "Cooked", "DanaCarveyStraightWhiteMale60", "FourSeasonsInHavana", "FullerHouse", "GabrielIglesiasImSorryForWhatISaidWhenIWasHungry", "GilmoreGirlsAYearInTheLife", "GraceAndFrankie", "HipHopEvolution", "HouseOfCards", "IDontFeelAtHomeAnymore", "JimGaffiganCinco", "KeithRichardsUnderTheInfluence", "LaNina", "LimenySticketsASeriesOfUnfortunateEvents", "Love", "LukeCage", "MakingAMurderer", "MarvelJessicaJones", "MasterOfNone", "MikrBirbigliaThankGodForJokes", "Narcos", "OneDayAtATime", "OrangeIsTheNewBlack", "SantaClaritaDiet", "StrangerThings", "TalesByLight", "Tallulah", "The13th", "TheCrown", "TheCubaLibreStory", "TheDoOver", "TheFundamentalsOfCaring", "TheOA", "TheRanch", "TheWhiteHelmets", "TokyoStories", "TonyRobbinsIAmNotYourGuru", "TrevorNoahAfraidOfTheDark", "UltimateBeastMaster", "UnbreakableKimmySchmidt", "WhatHappenedMissSimone", "WhiteRabbitProject", "WinterOnFireUkrainesFightForFreedom"];
  var thumbNailHtmlTemplate = detatchThumbNailHtmlTemplate();
  // var providerHtmlTemplate = detatchProviderHtmlTemplate();
  var userVideoProviders = getVideoProviders();
  subscribeToSearchTermChangedEvent();
  subscribeToSubmitEvent();
  filterMovies();

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

  function addImage(imageId){
    getThumbNailContainer().append(getThumbNailElementHtml(imageId));
  }

  function getThumbNailContainer(){
    return $("#thumbNailsContainer.row");
  }

  function getThumbNailsContainerSelector(){
    return "#thumbNailsContainer";
  }

  function findAndDisplayMovies(moviesSearchTerm){
    var foundMovies = searchForMovies(moviesSearchTerm);
    clearImages();
    addImages(foundMovies);
  }

  function searchForMovies(moviesSearchTerm){
    var foundMovies = [];

    var pattern = new RegExp(moviesSearchTerm, "i");

    for(imageIdIndex = 0; imageIdIndex < imageIds.length; imageIdIndex++) {
      if(pattern.test(imageIds[imageIdIndex])){
        foundMovies.push(imageIds[imageIdIndex]);
      }
    }
    return foundMovies;
  }

  function simulateSearch(moviesSearchTerm) {
    var foundMovies = [];
    startingIndex = Math.floor((Math.random() * imageIds.length)); 

    for(i = 0; i < 10; i++){
      foundMovies[i] = imageIds[(startingIndex + i) % imageIds.length];
    }

    return foundMovies;
  }

  function addImages(images){
    for(imageIndex = 0; imageIndex < images.length; imageIndex++){
      addImage2(images[imageIndex]);
    }
  }

  function findAndDisplayMovies2(videoProviders, moviesSearchTerm){
    clearImages();

    var videosMap = new Object();

    for (var videoProviderIndex = 0; videoProviderIndex < videoProviders.length; videoProviderIndex++){
      var videoProvider = videoProviders[videoProviderIndex];
      var videoIds = videoProvider.findVideos(moviesSearchTerm);

      for(var videoIdIndex = 0; videoIdIndex < videoIds.length; videoIdIndex++){
        var videoProvidersMap = videosMap[videoIds[videoIdIndex]];

        if (!videosMap.hasOwnProperty(videoIds[videoIdIndex]))
        {
          videoProvidersMap = new Object();
          videosMap[videoIds[videoIdIndex]] = videoProvidersMap;
        }

        videoProvidersMap[videoProvider.providerName] = videoProvider;
      }
    }

    addImagesFromMap(videosMap);
  }

  function addImagesFromMap(videosMap){
    for(var videoName in videosMap){
      addImageFromMap(videoName, videosMap[videoName]);
    }
  }

  function addImageFromMap(videoName, videoProviders){
    var thumbNailContainer = getThumbNailContainer2(videoName);
    
    for(var providerName in videoProviders){
      thumbNailContainer.addClass(getVideoProviderClassName(providerName));
    }

    thumbNailContainer.appendTo(getThumbNailsContainerSelector());
  }

  function getVideoProviderClassName(providerName){
    return providerName;
    // return "VideoProvider_" + providerName;
  }

  function getVideoProviders(){
    var videoProviders = [];
    videoProviders.push(new VideoProvider("Amazon", "Amazon.jpg", imageIds));
    videoProviders.push(new VideoProvider("Netflix", "Netflix.jpg", imageIds));
    videoProviders.push(new VideoProvider("Xfinity", "Xfinity", imageIds));
    videoProviders.push(new VideoProvider("Hulu", "Hulu", imageIds));
    return videoProviders;
  }

  function VideoProvider(providerName, providerIconName, videoUniverse){
    this.providerName = providerName;
    this.providerIconName = providerIconName;
    this.videos = videoUniverse;
    this.findVideos = function(moviesSearchTerm){
      var foundMovies = [];

      var pattern = new RegExp(moviesSearchTerm, "i");
      var thisProviderVideoPattern = new RegExp(this.providerName.charAt(0), "i");

      for(imageIdIndex = 0; imageIdIndex < imageIds.length; imageIdIndex++) {
        if(thisProviderVideoPattern.test(this.videos[imageIdIndex]) && pattern.test(imageIds[imageIdIndex])){
          foundMovies.push(this.videos[imageIdIndex]);
        }
      }
      return foundMovies;
    };
  }

  function removeImage(imageId){
    $(getImageIdSelector(imageId)).remove();
  }

  function getImageIdSelector(imageId){
    return "#" + imageId;
  }

  function removeImages(images){
    for(imageIndex = 0; imageIndex < images.length; imageIndex++){
      removeImage(images[imageIndex]);
    }
  }

  function clearImages() {
    $(".thumb").remove();
    // $(getImageClassSelector()).remove();
  }

  function getImageClassSelector(){
    return ".whereToWatchImage";
  }

  function addImage2(imageId){
    getThumbNailContainer2(imageId).appendTo(getThumbNailsContainerSelector());
  }

  function getThumbNailContainer2(imageId){
    thumbNailContainer = thumbNailHtmlTemplate.clone();
    thumbNailContainer.attr("id", "imageId");
    thumbNailContainer.children(0).children(0).attr("src", getImagePathByImageId(imageId));
    thumbNailContainer.addClass(getImageClassSelector());
    return thumbNailContainer;
  }

  function getThumbNailElementHtmlByImageId(imageId){
    return "<div class=\"col-lg-3 col-md-4 col-xs-6 thumb\">" +
           "<a class=\"thumbnail\" href=\"#\">" + 
           "<img class=\"img-responsive\" " +
           "src=\"smiley.gif\" alt=\"\" " +
           "</a>" +
           "</div>";
  }

  function getThumbNailElementHtml(imageId){
    return "<div class=\"col-lg-3 col-md-4 col-xs-6 thumb\">" +
           "<a class=\"thumbnail\" href=\"#\">" + 
           "<img class=\"img-responsive\" " + 
           "src=\"" + 
           getImagePathByImageId(imageId) + 
           "\" alt=\"\"" +
           // "style=\"width:400px;height:300px;border:0\"" + 
           ">" + 
           "</a>" +
           "</div>";
  }

  function getImagePathByImageId(imageId){
    return "images/moviesArt/" + imageId + ".jpg";
  }

  function getNextImageId(){
    if(imageIndex >= imageIds.length){
      imageIndex = 0;
    }

    var imageId = imageIds[imageIndex];
    imageIndex = imageIndex + 1;
    return imageId;
  }

  function monthSorter(a, b) {
    if (a.month < b.month) return -1;
    if (a.month > b.month) return 1;
    return 0;
  }

  function filterVideosByProvider(providerName){
    $("." + providerName).hide();
  }

});