export default function dist(a, b, c, d) {
  if(typeof a === 'object' && typeof b === 'object'){
    return ((a.x-b.x)**2 + (a.y-b.y)**2)**0.5;
  } if (c && d){
    return ((a-c)**2 + (b-d)**2)**0.5;
  } else {
    throw new Error('can\'t calculate the distance, check that you passed two vectors or 4 numbers x1,y1,x2,y2');
  }
}
