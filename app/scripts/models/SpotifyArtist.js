import $ from 'jquery';
import Backbone from 'backbone';
import Spotify from 'spotify-web-api-js';


import TrackCollection from './SpotifyTrackCollection';

import ParseModel from './ParseModel';


var SpotifyApi = new Spotify();


var Artist = ParseModel.extend({

  spotifyApi: SpotifyApi,

  urlRoot: 'https://api.spotify.com/v1/search',

  defaults: {
    name: '',
    spotify: false,
    searched: false,
    added: false,
    tracks: new TrackCollection(),
    tracksFetched: 0,
    fetching: false,
    fetched: true
  },



  getTopTracks: function(number, callback){
    var self = this;
    number = (number) ? number : 3;

    if(! this.get('spotify') ){
      return false;
    }

    this.spotifyApi.getArtistTopTracks(this.get('spotifyId'), 'US')
      .then(function(data){

        var tracks = data.tracks.slice(0,number).map(function(track){
          self.set({fetching: true});

          var album = {
            type:   track.album['album_type'],
            id:     track.album.id,
            images: track.album.images,
            uri:    track.album.uri
          };
          return {
            album:      album,
            uri:        track.uri,
            id:         track.id,
            name:       track.name,
            explicit:   track.explicit,
            mp3Url:     track['preview_url'],
            duration:   track['duration_ms'],
            number:     track['track_number'],
            popularity: track.popularity,
            artist:     self
          };

        });

        self.get('tracks').set(tracks);
        self.set({
          tracksFetched: tracks.length,
          fetching:      false,
          fetched:       true
        });
        return tracks;
      },

      function(err) {
        console.error(err);
      });
  },

  search: function(){
    var self = this;

    this.spotifyApi.searchArtists(this.get('name'), {limit: 1})
    .then(function(data) {
      var artist = {};
      var items  = data.artists.items

      artist.searched = true;

      if(items.length < 1) {
        artist.spotify = false;
      }
      else {
        var r     = data.artists.items[0];
        var match = self.get('name').toUpperCase() !== r.name.toUpperCase()

        if(match){
          artist.spotify = false;
        }
        else {
          artist = {
            spotify:     true,
            spotifyId:   r.id,
            id:          r.id,
            uri:         r.uri,
            genres:      r.genres,
            images:      r.images,
            popularity:  r.popularity,
            spotifyName: r.name,
            spotifyLink: r['external_urls'].spotify
          };
        }
      }

      self.set(artist);
    },

    function(err) {
      console.error(err);
    });
  }

});


export default Artist;
