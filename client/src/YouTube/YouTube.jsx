
import { useEffect, useState } from "react";
import React from "react";
import "./YouTube.css";

const YouTube = () => {
  const [YouTubeVideos, setVideo] = useState([]);

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCE_M8A5yxnLfW0KghEeajjw&order=date&type=video&maxResults=6&key=AIzaSyBm4YhHniHiLNJKNiS0fZapg5RyycBpsbI`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const youTubeVideosData = data.items || [];
        setVideo(youTubeVideosData);
      })
      .catch((error) => {
        console.error("YouTube API Error:", error);
        setVideo([]);
      });
  }, []);

  return (
    <div>
      <div className="allVidesoWrapper">
        <div className="container">
          <div className="row justify-content-center text-center">

            <div className="col-12">
              <div className="title-wraper">
                Latest videos
                <br />
              </div>
            </div>

            {YouTubeVideos.map((singleVideo) => {
              const vidId = singleVideo.id.videoId;

              const vidLink = `https://www.youtube.com/watch?v=${vidId}`;

              return (
                <div
                  key={vidId}
                  className="col-sm-12 col-md-6 col-lg-4"
                >
                  <div className="singleVideoWrapper">

                    <div className="videoThumbnail">
                      <a
                        href={vidLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={singleVideo.snippet.thumbnails.high.url}
                          alt={singleVideo.snippet.title}
                        />
                      </a>
                    </div>

                    <div className="videoInfoWrapper">

                      <div className="videoTitle">
                        <a
                          href={vidLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {singleVideo.snippet.title}
                        </a>
                      </div>

                      <div className="videoDes">
                        {singleVideo.snippet.description}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTube;

