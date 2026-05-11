<?php

use App\Http\Controllers\Api\PlaceController;
use Illuminate\Support\Facades\Route;
use App\Models\Place; 
use Illuminate\Http\Request;


Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{id}', [PlaceController::class, 'show']);
Route::put('/places/{id}', [PlaceController::class, 'update']);

Route::post('/places', [PlaceController::class, 'store']); 
Route::post('/places/{id}/favorite', [PlaceController::class, 'toggleFavorite']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/places/{id}/check', [PlaceController::class, 'updateChecklist']);
});

