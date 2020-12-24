
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Pass scope as string when generating js function.
- `latex2js`
-  
### Changed
### Fixed
### Deprecated
### Removed
### Security

## [1.0.0-0] - 2020-9-14

### Added
- Import (es6 import) or require (commonjs) specific method to accelerate app loading, and to minimize your bundle size.
- `geometry.lines`:
  - `equation`
  - `intersection`
  - `projection`
  - `distance`
- Add a header to the bundled file.
- `fraction`:
  - `frac`
  - `quotRem`

### Changed
- Rename `parser` to `engine`, for semantic purpose, and it is a more existing name.


## [0.1.0] - 2020-9-9
### Added
- Use the package [angles.js](https://www.npmjs.com/package/angles), extending some new APIs, (methods), here below.
- `fromDeg`, `fromRad` and `fromGon`
- In `geometry.angles.degMinSec`, you can get {deg, min, sec}. Convert  float number into degrees, minutes, and seconds.
- `geometry.angles.strDegMinSec`, you can get an angle formatted as (12° 3' 5"). Convert float number or {deg, min, sec} into a string representing the angle in degrees, minutes, and seconds.
- `geometry.angles.fromDegMinSec`, reverts the function `degMinSec`.
- `geometry.angles.fromStrDegMinSec`, reverts the function `strDegMinSec`.
- Alias some long-name function: replace degMinSec with `DMS`. For example, `fromStrDegMinSec` = `fromStrDMS` and `digMinSec` = `DMS`.
- `geometry.angles.nomalizeInside`, gets the equivalent engle inside a complete round starting from a given offset. For example, you can accomplish the same result with `angles.normalizeHalf(angle)` and `angles.normalizeInside(angles, -0.5)`, -0.5 here is the offset (-50%) of our range which the angle will be normalized in.


## [0.0.2] - 2020-9-4
### Fixed
- The second trial to fix the README file issue, after asking [a question](https://stackoverflow.com/questions/63733460/readme-is-deformed-in-npmjs-but-appears-in-github) in "stackoverflow".



## [0.0.1] - 2020-9-4
### Fixed
- Change README.md from a binary looking file into a file in bytes, there was weird README in [rakam](https://npmjs.com/package/rakam).


## [0.0.0] - 2020-9-4

### Added

- `math2js` to convert math expression from a string into real js function by generating the code then evaluating it.

- `geometry.angles` property in the exported library, with angles you can get:
  - the angle between two vectors or lines, in a clockwise direction or the other one. You can also trim or normalize the angle to be between 0 and 360.
  - the min angle between two vectors or lines, in either direction
  - as well as the max angle

- `geometry.lines`, here you can get: 
  - line equation `ax+by+c=0`, the line info returned as {a:number,b:number,c:number}
  - the intersection point between two lines
  - projection of a point on a line
  - the dist, or the displacement till the line from a given point, the shortest distance to the line, which is the length of the perpendicular line to this line from that point.

- `core`: that contains some useful functions such as `lcm`, `gcd`, `constrain`, `dist`

