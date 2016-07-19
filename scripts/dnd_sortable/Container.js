import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const style = {
  width: 400
};

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library'
      }, {
        id: 2,
        text: 'Make it generic enough'
      }, {
        id: 3,
        text: 'Write README'
      }, {
        id: 4,
        text: 'Create some examples'
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'
      }, {
        id: 6,
        text: '???'
      }, {
        id: 7,
        text: 'PROFIT'
      }]
    };
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    console.log('cards',cards)
    // index of cardTarget currently hovered over
    console.log('dragIndex',dragIndex)
    // card that is currently dragged from position
    // at dragIndex
    const dragCard = cards[dragIndex];
    console.log('dragCard',dragCard)
    console.log('hoverIndex', hoverIndex)

    // replace position of dragCard, the dragIndex
    // with position of hover, the hoverIndex
    // i.e. move dragCard from dragIndex to position 
    // of hoverIndex in cards-array
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
    console.log(this.state.cards)
  }

  render() {
    const { cards } = this.state;

    return (
      <div style={style}>
        {cards.map((card, i) => {
          return (
            <Card key={card.id}
                  index={i}
                  id={card.id}
                  text={card.text}
                  moveCard={this.moveCard} />
          );
        })}
      </div>
    );
  }
}