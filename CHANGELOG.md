
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Fixed
### Deprecated
### Removed
### Security

## [0.0.2] - 2020-9-4
### Fixed
- the second trial to fix readme file issue, after asking [a question](https://stackoverflow.com/questions/63733460/readme-is-deformed-in-npmjs-but-appears-in-github) in stackoverflow.



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

- `geometry.lines`: here you can get 
 - line equation `ax+by+c=0`, the line info returned as {a:number,b:number,c:number}
 - the intersection point between two lines
 - projection of a point on a line
 - the dist, or the displacement till the line from a given point, the shortest distance to the line, which is the length of the perpendicular line to this line from that point.

- `core`: that contains some useful functions such as `lcm`, `gcd`, `constrain`, `dist`

