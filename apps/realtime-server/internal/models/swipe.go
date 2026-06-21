package models

type SwipeStatus string

const (
    SwipeLike      SwipeStatus = "LIKE"
    SwipeDislike   SwipeStatus = "DISLIKE"
    SwipeSuperlike SwipeStatus = "SUPERLIKE"
)