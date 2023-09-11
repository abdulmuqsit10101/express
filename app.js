const fs = require('fs');
const morgan = require('morgan');
const express = require('express');

const app = express();
// * Middleware
app.use(express.json())
app.use(morgan('dev'));


app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    console.log('reqestedAt : ', req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        tours
    });
}

const createNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) return res.status(404).send('Something went wrong');
        res.status(201).json({
            status: 'success',
            data: newTour,
        })
    })
}

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const updateTour = (req, res) => {
    if (Object.keys(req.body).length === 0 || req.body === undefined) {
        return res.status(404).json({
            status: 'fail',
            message: 'Body must not b empty!'
        })
    }

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    const indexOfTour = tours.indexOf(tour);
    const newTour = Object.assign({ ...tour }, req.body);
    console.log('indexOfTour => ', indexOfTour);
    tours[indexOfTour] = newTour;

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) return res.status(404).send('Something went wrong');
        res.status(200).json({
            status: 'success',
            data: newTour,
        })
    })
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    const updateToursList = tours.filter(el => el.id !== id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(updateToursList), (err) => {
        if (err) return res.status(404).send(`Something went wrong ${err?.message || err}`);
        res.status(204).json({
            status: "success",
            data: "null"
        })
    })
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    })
}

const createNewUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    })
}

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
    .route('/')
    .get(getAllTours)
    .post(createNewTour);

tourRouter
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

userRouter
    .route('/')
    .get(getAllUsers)
    .post(createNewUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


// Server Listening

const port = 3000;
app.listen(port, () => {
    console.log(`App is runing on ${port} ... `,);
})