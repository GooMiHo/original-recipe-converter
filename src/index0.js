
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ingrArray} from './ingredient-conv-chart';


function convertCupRemainders(remainingCups){
  let cupsToTblOrTsp = [
    {cup: 0.06, cupTblsTsp: '1 Tbls', unit: ' Tbls'},
    {cup: 0.02, cupTblsTsp: '1 tsp', unit: ' tsp'},
    {cup: 0.03, cupTblsTsp: '1/2 Tbls', unit: ' Tbls'},
    {cup: 0.018, cupTblsTsp: '7/8 tsp', unit: ' tsp'},
    {cup: 0.016, cupTblsTsp: '3/4 tsp', unit: ' tsp'},
    {cup: 0.013, cupTblsTsp: '5/8 tsp', unit: ' tsp'},
    {cup: 0.01, cupTblsTsp: '1/2 tsp', unit: ' tsp'},
    {cup: 0.008, cupTblsTsp: '3/8 tsp', unit: ' tsp'},
    {cup: 0.005, cupTblsTsp: '1/4 tsp', unit: ' tsp'},
    {cup: 0.003, cupTblsTsp: '1/8 tsp', unit: ' tsp'}
  ];

  let smallerRemainder;
  let largerMeasuringUnit = '';
  let count = 1;

  while ( remainingCups > 0.002 ) {
    for(let i = 0; i < cupsToTblOrTsp.length; i++) {
      if( remainingCups >= cupsToTblOrTsp[i].cup && remainingCups >= 0.003) {
        let numberOfCupsTblsTsp = Math.floor(remainingCups / cupsToTblOrTsp[i].cup);
        smallerRemainder = Number( (remainingCups - (numberOfCupsTblsTsp * cupsToTblOrTsp[i].cup)).toFixed(3) );
        if( smallerRemainder < 0.003 && count > 1) {
          largerMeasuringUnit += 'and ';
        }
        if(cupsToTblOrTsp[i].cup === cupsToTblOrTsp[0].cup || cupsToTblOrTsp[i].cup === cupsToTblOrTsp[1].cup) {
          largerMeasuringUnit += numberOfCupsTblsTsp + cupsToTblOrTsp[i].unit;
        }
        else {
          largerMeasuringUnit += cupsToTblOrTsp[i].cupTblsTsp;
        }

          if( smallerRemainder < 0.003 ) {
          return largerMeasuringUnit;
          }
          else {
              remainingCups = smallerRemainder;
              largerMeasuringUnit += ', ';
              count++;
          }

      }
    }
  }
}

  let cupsToFractions = [
    {cup: 0.75, fraction: '3/4 cup'},
    {cup: 0.67, fraction: '2/3 cup'},
    {cup: 0.50, fraction: '1/2 cup'},
    {cup: 0.33, fraction: '1/3 cup'},
    {cup: 0.25, fraction: '1/4 cup'},
  ];


function cupFraction(cupDecimal){
  for(let i = 0; i < cupsToFractions.length; i++) {
    if(cupDecimal >= cupsToFractions[i].cup) {
      return cupsToFractions[i].fraction;
    }
  }

}

function cupFractionRemainder(cupDecimal){
  let remainingDecimal;
  if( cupDecimal >= .25 )
    for(let i = 0; i < cupsToFractions.length; i++) {
      if(cupDecimal >= cupsToFractions[i].cup) {
        remainingDecimal = Number( (cupDecimal - cupsToFractions[i].cup).toFixed(3) );
        return remainingDecimal;
      }
    }
  else {
    return cupDecimal;
  }

}

function allRemainders(cups) {
  let tblsAndTsp = convertCupRemainders(cupFractionRemainder(cups));
  let fractionsOfCups = cupFraction(cups);
  let string = '';

  if(fractionsOfCups && tblsAndTsp) {
    string += fractionsOfCups;
    if (tblsAndTsp.length > 8) {
      string += ` ${tblsAndTsp}`;
    }
    else {
      string += ` and ${tblsAndTsp}`;
    }
  }
  else if (fractionsOfCups) {
    string += fractionsOfCups;
  }
  else if (tblsAndTsp) {
    string += tblsAndTsp;
  }

 return string;
}





class RecipeConverter {
  constructor(gramsToComp, cupsToComp) {
    this._gramsToComp = gramsToComp;
    this._cupsToComp = cupsToComp;
  }

  set gramsToComp(newGrams) {
    if(typeof newGrams === 'number' && newGrams === Math.abs(newGrams)) {
      this._gramsToComp = newGrams;
    }
  }

  set cupsToComp(newCups) {
    if(typeof newCups === 'number' && newCups === Math.abs(newCups)) {
      this._cupsToComp = newCups;
    }

  }

  get gramsToComp() {
    return this._gramsToComp;
  }

  get cupsToComp() {
    return this._cupsToComp;
  }

  convertGramstoCups(amountInGrams) {
    let convertedCups = (this._cupsToComp * amountInGrams) / this._gramsToComp;
    let convertedCupsFull = Math.floor(convertedCups);
    //let string = convertedCupsFull.toString();
    let remainder = Number( (convertedCups - convertedCupsFull).toFixed(3) );
    let finalString = '';

    if(remainder < 0.003) {
      return convertedCupsFull;
    }

    else {
        if(convertedCupsFull === 0) {
          finalString = allRemainders(remainder);
        }
        else {
            finalString =`${convertedCupsFull}  ${allRemainders(remainder)}`;

        }

        return finalString;
      }
    }
}




//------------ shows dropdown menu with ingredient options -----------------
const list = document.getElementById("ingredientList");

 let word = [];

 ingrArray.forEach(x => {
   word.push(x.wordCheck)
 })

word.forEach(item => {
  let option = document.createElement('option');
  option.value = item;
  list.appendChild(option);
});
//finds the index in ingredient-conv-chart

//-------------------------------------------------------------------------

let itemsAndAmounts = [];

function addNewItem(wordToFind, amountToConvert) {

    let indexFound = word.indexOf(wordToFind);
    const IngredientConveter = new RecipeConverter(ingrArray[indexFound].grams, ingrArray[indexFound].cups);
    let newItem = `${IngredientConveter.convertGramstoCups(amountToConvert)} ${ingrArray[indexFound].ingredient}`;
    itemsAndAmounts.push(newItem);

    const recipeLis = itemsAndAmounts.map((item, i) =>
    <li key={'item_' + i}>{item}
    </li>
    );

    ReactDOM.render(<ul>{recipeLis}</ul>, document.getElementById('root'));


}


document.getElementById("pressedBotton").addEventListener("click", function() {
    let ingredientEntered = document.getElementById("ingredientEntered").value;
    let amountEntered = document.getElementById("grams").value;
    addNewItem(ingredientEntered, amountEntered);
    document.getElementById("ingredientEntered").value = "";
    document.getElementById("grams").value = "";
}, false);


//------------------------------------------------------------------------
