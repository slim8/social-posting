<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Models\TextMediaNews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TextMediaNewsController extends Controller
{
    use RequestsTrait;
    protected $fileController;

    /**
     * Construct
     */

     public function __construct()
     {
        $this->fileController = new FileController();
     }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'title' => 'required',
            'subtitle' => 'required',
            'description' => 'required',
            'newsId' => 'required',
            'image' => 'required|mimes:png,jpg,jpeg'
        ]);

        if($validation->fails()){
            return RequestsTrait::processResponse(false , [ "error" => $validation->errors()]);
        }

        try{
            $picture = $this->fileController->uploadLocalAndReturnObject( $request->file('image'), 'image' );
            TextMediaNews::create([
                'title' => $request->title,
                'subtitle' => $request->subtitle,
                'description' => $request->description,
                'picture' => json_encode($picture),
                'newsId' => $request->newsId,
            ]);
            return RequestsTrait::processResponse(true);
        }catch(\Exception $e){
            return RequestsTrait::processResponse(false , [ "error" => $e->getMessage() ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $validation = Validator::make($request->all(), [
            'title' => 'required',
            'subtitle' => 'required',
            'description' => 'required',
            'newsId' => 'required',
        ]);

        if($validation->fails()){
            return RequestsTrait::processResponse(false , [ "error" => $validation->errors()]);
        }

        try{
            $textMedia = TextMediaNews::where('id' , $id)->first();
            if($request->file('image')){
                Storage::delete(json_decode($textMedia->picture)->name);
                $picture = $this->fileController->uploadLocalAndReturnObject( $request->file('image'), 'image' );
                $textMedia->picture = json_encode($picture);
            }
            $textMedia->title = $request->title;
            $textMedia->subtitle = $request->subtitle;
            $textMedia->description = $request->description;
            $textMedia->newsId = $request->newsId;
            $textMedia->save();

            return RequestsTrait::processResponse(true);
        }catch(\Exception $e){
            return RequestsTrait::processResponse(false , [ "error" => $e->getMessage() ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $textMedia = TextMediaNews::where('id' , $id)->first();
            Storage::delete(json_decode($textMedia->picture)->name);
            $textMedia->delete();
            
            return RequestsTrait::processResponse(true);
        }catch(\Exception $e){
            return RequestsTrait::processResponse(false , [ "error" => $e->getMessage() ]);
        }
    }
}
