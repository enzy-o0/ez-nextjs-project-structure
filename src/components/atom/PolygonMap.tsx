import { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import proj4 from 'proj4';
import { xml2json } from 'xml-js';
import * as turf from '@turf/turf';
import { Button } from '@paljs/ui/Button';

interface props {
  address?: any;
  addresses: any;
  locationInfo?: any;
  isReadOnly: any;
  isRemovedIdx?: any;
}

export const PolygonMap = ({ locationInfo, addresses, isReadOnly }: props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentGPSLocation, setCurrentGPSLocation] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState<string>(null);
  const [isSearchClick, setIsSearchClick] = useState<boolean>(false);
  let locations: [] = [];

  const loadMap = async () => {
    await loadMapScript();
  };

  if (typeof window !== 'undefined') {
    window.initMap = () => {
      if (mapRef.current) {
        initMap(mapRef);
      }
    };
  }

  const onClickSearch = () => {
    !isSearchClick && setIsSearchClick(true);
  };

  useEffect(() => {
    searchKeyword && initMap(mapRef, 'search');
  }, [isSearchClick]);

  const onClickCurrentGPSLocation = () => {
    if (!currentGPSLocation) {
      if (!navigator.geolocation) {
        status = '지원하지않는 브라우저입니다.';
      } else {
        status = 'gps 정보 가져오는 중...';
        navigator.geolocation.getCurrentPosition(
          (position) => {
            status = '';
            setCurrentGPSLocation({ longitude: position.coords.longitude, latitude: position.coords.latitude });
          },
          () => {
            status = 'gps 정보를 가져올 수 없습니다.';
          },
        );
      }

      initMap(mapRef, 'gps');
    }
  };

  useEffect(() => {
    loadMap();
  }, [isReadOnly]);

  const initMap = (mapRef, type) => {
    setIsSearchClick(false);
    let __mapAdjustments = {
      latitude: 0,
      longitude: 0,
    };
    let initGeoJson = function () {
      return {
        type: 'FeatureCollection',
        features: [],
      };
    };

    let geojson = initGeoJson();
    let isSearch = false;

    // 연속지적도 api url default 세팅
    const localSettings = {
      mapType: 'satellite',
      nsdiopenapiurl: 'http://openapi.nsdi.go.kr/nsdi/map/CtnlgsSpceService/wfs/getCtnlgsSpceWFS',
      nsdiopenapiauthKey: '',
      pictureTypeName: 'F6',
      srsName: 'EPSG:5174',
      bbox: '',
      pnu: '1111010100100010000',
      polylineepsg5174: '',
      polylineepsg4326WGS84: '',
      PolygonCoordinates: currentGPSLocation,
      centerPoint: currentGPSLocation,
    };

    // 연속지적도 api url 설정
    let getGEOPolylines = (pnu, bbox?) => {
      var parameter = '?' + encodeURIComponent('authkey') + '=' + encodeURIComponent(localSettings.nsdiopenapiauthKey);
      parameter += '&' + encodeURIComponent('typename') + '=' + encodeURIComponent(localSettings.pictureTypeName);
      parameter += '&' + encodeURIComponent('bbox') + '=' + encodeURIComponent(bbox);
      parameter += '&' + encodeURIComponent('pnu') + '=' + encodeURIComponent(pnu);
      parameter += '&' + encodeURIComponent('maxFeatures') + '=' + encodeURIComponent('100');
      parameter += '&' + encodeURIComponent('resultType') + '=' + encodeURIComponent('results');
      parameter += '&' + encodeURIComponent('srsName') + '=' + encodeURIComponent(localSettings.srsName);
      var url = localSettings.nsdiopenapiurl + parameter;
      fetchGeoJson(url);
    };

    var NSDIPNUElement = [];

    // 연속지적도 api 호출
    const fetchGeoJson = function (url) {
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then(function (response) {
          var result = JSON.parse(xml2json(response));
          var featureCollectionElement;
          result.elements.forEach(function (element) {
            if (element.name == 'wfs:FeatureCollection') {
              featureCollectionElement = element;
            }
          });
          var featureMemberElements = [];

          featureCollectionElement.elements.forEach(function (featureMember) {
            if (featureMember.name == 'gml:featureMember') {
              var NSDIF6Element;

              featureMember.elements.forEach(function (element, idx) {
                if (element.name == 'NSDI:F6') {
                  NSDIF6Element = element;

                  if (idx === 0) {
                    NSDIPNUElement.push(element.elements[0].elements[0].text);
                  }
                }
              });
              var NSDISHAPEElement;
              NSDIF6Element.elements.forEach(function (element) {
                if (element.name == 'NSDI:SHAPE') {
                  NSDISHAPEElement = element;
                }
              });
              var polylineepsg5174 =
                NSDISHAPEElement.elements[0].elements[0].elements[0].elements[0].elements[0].elements[0].elements[0]
                  .text;
              var epsg4326WGS84ProjectionCoordinates = convertCoordinates(polylineepsg5174);
              featureMemberElements.push(epsg4326WGS84ProjectionCoordinates);
            }
          });

          map.data.removeGeoJson(geojson);
          featureMemberElements.forEach(function (geocoordinates) {
            upsertFeature(geojson, geocoordinates);
          });

          map.data.addGeoJson(geojson);

          if (isSearch) {
            setStylePoint();
            isSearch = false;
          }
        })
        .catch(function (error) {
          alert(
            '오류 : 국가공간정보포털 api의 오류로 토지 선택이 불가합니다.\n정확한 토지 주소(지번 포함)를 입력해주세요.',
          );

          console.log(error);
          window.naver.maps.Event.removeListener(listener);
        });

      var upsertFeature = function (geojson, coordinates) {
        var _coordinates = [];

        coordinates.forEach(function (each) {
          _coordinates.push([each.longitude, each.latitude]);
        });
        var bExists = false;
        for (var cnt = 0; cnt < geojson.features.length; cnt++) {
          var feature = geojson.features[cnt];
          bExists = feature.geometry.coordinates[0].equals(_coordinates);

          if (bExists) {
            break;
          }
        }
        if (bExists == false) {
          geojson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [_coordinates],
            },
            selected: false,
          });
        }
      };
    };
    Array.prototype.equals = function (array) {
      if (!array) return false;
      if (this.length != array.length) return false;
      for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
          if (!this[i].equals(array[i])) return false;
        } else if (this[i] != array[i]) {
          return false;
        }
      }
      return true;
    };
    Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
    var epsg5174Projection =
      '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43';
    var epsg4326WGS84Projection = '+proj=longlat +datum=WGS84 +no_defs ';
    const convertCoordinates = function (polylineepsg5174) {
      var convertString2Coordinates = (stringCoordinates) => {
        var nums = stringCoordinates.split(' ');
        var result = [];
        for (var i = 0; i < nums.length; i++) {
          var firstnum = parseFloat(nums[i]);
          i++;
          var secondnum = parseFloat(nums[i]);
          result.push([firstnum, secondnum]);
        }
        return result;
      };
      var polylineepsg5174coordinates = convertString2Coordinates(polylineepsg5174);
      var _result = [];
      for (var i = 0; i < polylineepsg5174coordinates.length; i++) {
        var result = proj4(epsg5174Projection, epsg4326WGS84Projection, polylineepsg5174coordinates[i]);
        _result.push({
          latitude: result[1] - __mapAdjustments.latitude,
          longitude: result[0] - __mapAdjustments.longitude,
        });
      }
      return _result;
    };

    var infoWindow = new window.naver.maps.InfoWindow({
      anchorSkew: true,
    });

    var isNullOrWhitespace = function (input) {
      if (typeof input === 'undefined') return true;
      if (typeof input === 'object') {
        if (input === null) return true;
        return false;
      }
      if (typeof input === 'string') {
        if (input === null) return true;
        return input.replace(/\s/g, '').length < 1;
      } else {
        return false;
      }
    };

    function searchCoordinateToAddress(latlng) {
      infoWindow.close();

      window.naver.maps.Service.reverseGeocode(
        {
          coords: latlng,
          orders: [window.naver.maps.Service.OrderType.ADDR, window.naver.maps.Service.OrderType.ROAD_ADDR].join(','),
        },
        function (status, response) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            if (latlng.toString) {
              return alert(`오류 : ReverseGeocode Error, latlng: ${latlng.toString()}`);
            }
            if (latlng.x && latlng.y) {
              return alert(`오류 : ReverseGeocode Error, x: ${latlng.x}, y: ${latlng.y}`);
            }
            return alert('오류: ReverseGeocode Error, Please check latlng');
          }

          var address = response.v2.address,
            htmlAddresses = [];

          if (address.jibunAddress !== '') {
            htmlAddresses.push(address.jibunAddress);
          }

          infoWindow.setContent(
            [
              '<div style="padding:10px;min-width:200px;line-height:150%;">',
              '',
              htmlAddresses.join('<br />'),
              '</div>',
            ].join('\n'),
          );
          infoWindow.open(map, latlng);
        },
      );
    }

    function clickOnMap(point, feature) {
      var event = { coord: {}, feature: feature };
      event.coord = point;

      naver.maps.Event.trigger(map, 'click', featureClick(event));
    }

    const setStylePoint = () => {
      let point = map.getCenter();
      let proj = map.getProjection();

      let convertInPosition = proj.fromCoordToPoint(point).toArray(),
        checkPoints = turf.points([convertInPosition]);

      map.data.forEach((feature, idx) => {
        let convertPaths = [];

        feature.geometryCollection[0].coords[0].flat().forEach((points) => {
          let latlng = new naver.maps.LatLng(points.y, points.x);
          convertPaths.push(proj.fromCoordToPoint(latlng).toArray());
        });

        var searchWithin = turf.polygon([convertPaths]);
        var within = turf.pointsWithinPolygon(checkPoints, searchWithin);

        if (within.features.length > 0) {
          clickOnMap(point, feature);

          return false;
        }
      });
    };

    // 면적 구하는 토지소유정보속성조회 api
    function getPossessionAttr(pnu) {
      var url = 'http://openapi.nsdi.go.kr/nsdi/PossessionService/attr/getPossessionAttr'; /*URL*/
      var parameter = '?' + encodeURIComponent('authkey') + '=' + encodeURIComponent(''); /*authkey Key*/
      parameter += '&' + encodeURIComponent('pnu') + '=' + encodeURIComponent(pnu); /* 고유번호(8자리 이상) */
      parameter +=
        '&' + encodeURIComponent('format') + '=' + encodeURIComponent('xml'); /* 응답결과 형식(xml 또는 json) */
      parameter += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* 검색건수 */
      parameter += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지 번호 */

      fetchPossessionAttr(url + parameter);
    }

    const fetchPossessionAttr = function (url) {
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((response) => {
          const result = JSON.parse(xml2json(response));
          let info = {
            farmland_area: 0,
            farmland_addr1: '',
          };

          result.elements[0].elements[3].elements.forEach((element, idx) => {
            element.elements.forEach((element) => {
              if (element.name === 'lndpclAr') {
                info.farmland_area += Number(element.elements[0].text);
              }

              if (idx === 0) {
                if (element.name === 'ldCodeNm') {
                  info.farmland_addr1 += element.elements[0].text;
                }

                if (element.name === 'mnnmSlno') {
                  info.farmland_addr1 += ` ${element.elements[0].text}`;
                }
              }
            });
          });

          locations.push(info);
          locationInfo([...locations]);
        });
    };

    function searchAddressToCoordinate(address) {
      window.naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            alert('주소찾기에 에러가 발생하였습니다. 주소를 다시 입력해주세요!');
            currentLocationBounds(false, true);
            return;
          }

          if (response.v2.meta.totalCount === 0) {
            alert('주소 찾기 결과가 없습니다.');
            currentLocationBounds(false, true);
            return;
          }

          var htmlAddresses = [],
            item = response.v2.addresses[0],
            point = new window.naver.maps.Point(item.x, item.y);

          if (item.jibunAddress) {
            htmlAddresses.push(item.jibunAddress);
          }

          infoWindow.setContent(
            [
              '<div style="padding:5px;min-width:200px;display:inline-block">',
              '',
              htmlAddresses.join('<br />'),
              '</div>',
            ].join('\n'),
          );

          map.setCenter(point);
          infoWindow.open(map, point);

          currentLocationBounds();
        },
      );
    }

    const currentLocationBounds = (isInit?, isError?) => {
      if (isInit) {
        searchCoordinateToAddress(map.getCenter());
      }

      if (!isError) {
        geojson = initGeoJson();
        isSearch = true;
      }

      initGeocoder();
      loadThisBoundsGeoJson();
    };

    var loadThisBoundsGeoJson = function () {
      var boundary = map.getBounds();
      var epsg5174ne = proj4(epsg4326WGS84Projection, epsg5174Projection, [
        boundary._ne.lng() + __mapAdjustments.longitude,
        boundary._ne.lat() + __mapAdjustments.latitude,
      ]);
      var epsg5174sw = proj4(epsg4326WGS84Projection, epsg5174Projection, [
        boundary._sw.lng() + __mapAdjustments.longitude,
        boundary._sw.lat() + __mapAdjustments.latitude,
      ]);
      var epsg5174bbox = epsg5174ne[0] + ',' + epsg5174ne[1] + ',' + epsg5174sw[0] + ',' + epsg5174sw[1];
      getGEOPolylines('', epsg5174bbox);
    };

    let listener;
    let selectedFeatureRow = [];
    function featureClick(e) {
      searchCoordinateToAddress(e.coord);
      map.data.forEach(function (f, i) {
        let isClicked;

        if (selectedFeatureRow.length) {
          if (f._raw === e.feature._raw) {
            f._raw.selected = e.feature._raw.selected == false;
            if (f._raw.selected) {
              selectedFeatureRow.push(e.feature._raw);
              getPossessionAttr(NSDIPNUElement[i]);
            } else {
              let idx = selectedFeatureRow.indexOf(e.feature._raw);
              selectedFeatureRow.splice(idx, 1);
              locations.splice(idx, 1);
              locationInfo([...locations]);
            }
          }
        } else {
          if (f._raw === e.feature._raw) {
            f._raw.selected = e.feature._raw.selected == false;

            if (f._raw.selected) {
              selectedFeatureRow.push(e.feature._raw);
              getPossessionAttr(NSDIPNUElement[i]);
            } else {
              let idx = selectedFeatureRow.indexOf(e.feature_raw);
              selectedFeatureRow.splice(idx, 1);
              locations.splice(idx, 1);
              locationInfo([...locations]);
            }
          } else {
            isClicked = selectedFeatureRow?.some((e) => e === f._raw);

            if (isClicked) {
              f._raw.selected = true;
            } else {
              f._raw.selected = false;
              selectedFeatureRow.filter((ele) => {
                return ele != e.feature._raw;
              });
            }
          }
        }
      });

      map.data.overrideStyle(e.feature, {
        fillColor: e.feature._raw.selected ? 'green' : 'transparent',
        strokeColor: e.feature._raw.selected ? 'green' : 'white',
        strokeWeight: e.feature._raw.selected ? 3 : 1,
      });

      map.data.revertStyle();
    }

    function initGeocoder() {
      !isReadOnly && map.data.addListener('click', featureClick);

      listener = window.naver.maps.Event.addListener(map, 'dragend', function (bounds) {
        loadThisBoundsGeoJson();
      });

      map.data.setStyle(function (e) {
        return {
          fillColor: e._raw.selected ? 'green' : 'transparent',
          strokeColor: e._raw.selected ? 'green' : 'white',
          strokeWeight: e._raw.selected ? 3 : 1,
        };
      });
    }

    var mapOptions = {
      mapTypeId: window.naver.maps.MapTypeId.SATELLITE,
      center: currentGPSLocation,
      minZoom: 16,
      maxZoon: 19,
      zoom: 19,
      draggable: !isReadOnly ? true : false,
      disableKineticPan: !isReadOnly ? true : false,
      keyboardShortcuts: !isReadOnly ? true : false,
      scrollWheel: !isReadOnly ? true : false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: false,
      mapTypeControl: false,
    };

    var map = new window.naver.maps.Map(mapRef.current, mapOptions);
    window.naver.maps.onJSContentLoaded = initGeocoder;
    window.naver.maps.Event.once(map, 'ini_stylemap', initGeocoder);

    if (type === 'search') {
      if (!isNullOrWhitespace(searchKeyword)) {
        searchAddressToCoordinate(searchKeyword);
      } else {
        currentLocationBounds(false, true);
      }
    } else if (type === 'gps') {
      currentLocationBounds();
    } else {
      if (addresses.length !== 0) {
        addresses.map((e) => {
          if (e.addr === '') {
            currentLocationBounds(false, true);
            return;
          }
          searchAddressToCoordinate(e.addr);
        });
      } else {
        currentLocationBounds(false, true);
      }
    }
  };

  const loadMapScript = () => {
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = `http://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=''&submodules=geocoder&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = () => {
        resolve();
      };
    });
  };

  return useMemo(
    () => (
      <>
        <MapWrapper className="mapWrapper">
          {!isReadOnly && (
            <SearchWapper>
              <Button className="primary" onClick={onClickCurrentGPSLocation}>
                GPS 현재위치
              </Button>
              <SearchForm>
                <SearchStyled
                  // onKeyPress={onKeyPress}
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  placeholder="검색하세요..."
                />
                <Button className="primary" style={{ marginLeft: 16 }} onClick={onClickSearch}>
                  검색
                </Button>
              </SearchForm>
            </SearchWapper>
          )}
          <Map ref={mapRef} id="map" />
        </MapWrapper>
      </>
    ),
    [mapRef],
  );
};

const SearchForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchStyled = styled.input`
  height: 36px;
  width: 20rem;
  border: 1px solid #edf1f7;
  border-radius: 0.25rem;
  outline: none;
  padding: 0 10px;
  border-color: #e4e9f2;
`;

const SearchWapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Map = styled.div`
  width: 100%;
  height: 100%;
  background-color: #eee;
  margin-top: 1rem;
`;

const MapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 30vh;
`;
