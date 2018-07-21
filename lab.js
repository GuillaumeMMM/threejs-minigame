getRandLabArray = function (maxX, maxY) {
    const labyrinthe = [];

    //  Set first block
    const firstBlock = { x: 1, y: 1 };
    labyrinthe.push(firstBlock);

    //  While the end is not reached
    while ((labyrinthe[labyrinthe.length - 1].x !== maxX || labyrinthe[labyrinthe.length - 1].y !== maxY)) {
        let newBlockUnique = false;
        while (!newBlockUnique) {
            const newBlock = {
                x: Math.round(maxX * Math.random()),
                y: Math.round(maxY * Math.random())
            };
            const filteredLab = labyrinthe.filter((block) => {
                return ((block.x === newBlock.x) && (block.y === newBlock.y));
            });
            if (filteredLab && filteredLab.length === 0) {
                newBlockUnique = true;
                labyrinthe.push(newBlock);
            }
        }
    }
    return labyrinthe;
}

getRandLabArray2 = function (maxX, maxY, density) {
    const labyrinthe = [];
    const numberOfSquares = Math.round(density * (maxX - 2) * (maxY - 2));
    //  Set sides blocks
    for (let i = 0; i < maxX + 1; i++) {
        labyrinthe.push({
            x: i,
            y: 0
        });
        labyrinthe.push({
            x: i,
            y: maxY
        });
    }
    for (let i = 0; i < maxY; i++) {
        labyrinthe.push({
            x: 0,
            y: i
        });
        labyrinthe.push({
            x: maxX,
            y: i
        });
    }

    //  While the end is not reached
    for (let i = 0; i < numberOfSquares - 1; i++) {
        let newBlockUnique = false;
        while (!newBlockUnique) {
            const newBlock = {
                x: 1 + Math.round((maxX - 2) * Math.random()),
                y: 1 + Math.round((maxY - 2) * Math.random())
            };
            const filteredLab = labyrinthe.filter((block) => {
                return ((block.x === newBlock.x) && (block.y === newBlock.y));
            });
            if (filteredLab && filteredLab.length === 0) {
                newBlockUnique = true;
                labyrinthe.push(newBlock);
            }
        }
    }
    return labyrinthe;
}

getLabArray = function (maxX, maxY) {
    const labyrinthe = [];

    //  Set first block
    const firstBlock = { x: 1, y: 1 };
    labyrinthe.push(firstBlock);

    //  While the end is not reached
    while ((labyrinthe[labyrinthe.length - 1].x < maxX || labyrinthe[labyrinthe.length - 1].y < maxY)) {
        const validBlocks = getValidBlocksFromHere(labyrinthe, maxX, maxY);
        let newBlock = {};
        if (validBlocks.length > 0) {
            newBlock = validBlocks[Math.round((validBlocks.length - 1) * Math.random())];
        } else {
            console.log('Error');
        }
        labyrinthe.push(newBlock);
    }
    return labyrinthe;
}

getValidBlocksFromHere = function (labyrinthe, maxX, maxY) {
    validBlocks = [];
    const numberOfElementsToInvestigate = Math.min(5, labyrinthe.length);
    for (let i = 0; i < numberOfElementsToInvestigate; i++) {
        if (labyrinthe[labyrinthe.length - i - 1].x + 1 === maxX && labyrinthe[labyrinthe.length - i - 1].y + 1 === maxY) {
            validBlocks.push({
                x: maxX,
                y: maxY
            });
        } else {
            if (labyrinthe[labyrinthe.length - i - 1].x + 1 < maxX) {
                validBlocks.push({
                    x: labyrinthe[labyrinthe.length - i - 1].x + 1,
                    y: labyrinthe[labyrinthe.length - i - 1].y
                });
            }
            if (labyrinthe[labyrinthe.length - i - 1].x - 1 >= 0) {
                validBlocks.push({
                    x: labyrinthe[labyrinthe.length - i - 1].x - 1,
                    y: labyrinthe[labyrinthe.length - i - 1].y
                });
            }
            if (labyrinthe[labyrinthe.length - i - 1].y - 1 >= 0) {
                validBlocks.push({
                    x: labyrinthe[labyrinthe.length - i - 1].x,
                    y: labyrinthe[labyrinthe.length - i - 1].y - 1
                });
            }
            if (labyrinthe[labyrinthe.length - i - 1].y + 1 < maxY) {
                validBlocks.push({
                    x: labyrinthe[labyrinthe.length - i - 1].x,
                    y: labyrinthe[labyrinthe.length - i - 1].y + 1
                });
            }
        }
    }
    validBlocks.forEach((block, ind) => {
        labyrinthe.forEach((labBlock) => {
            if (block.x === labBlock.x && block.y === labBlock.y) {
                validBlocks.splice(ind, 1);
            }
        });
    });
    return validBlocks;
}