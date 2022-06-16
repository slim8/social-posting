<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Models\Dictionary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DictionaryController extends Controller
{
    use RequestsTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return RequestsTrait::processResponse(true , ['dictionay' => Dictionary::all()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $validation = Validator::make($request->all(), [
            'key' => 'required',
            'value' => 'required',
        ]);

        $validation->sometimes('key', 'required|integer', function($input) {
            return $input->type_id == 3;
        });

        if($validation->fails()){
            return RequestsTrait::processResponse(false , [ "error" => $validation->errors()]);
        }

        Dictionary::create([
            'key' => strtoupper($request->key),
            'value' => $request->value,
            'lang' => $request->lang,
        ]);
        return RequestsTrait::processResponse(true);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request , $key)
    {
        //
        $lang = $request->lang ? $request->lang : '%%';
        $element = Dictionary::where('key',$key)->where('lang','like',$lang)->first();
        return RequestsTrait::processResponse(true , [ "dictionary" => $element]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $key)
    {
        //
        $validation = Validator::make($request->all(), [
            'value' => 'required',
        ]);

        if($validation->fails()){
            return RequestsTrait::processResponse(false , ["error" => $validation->errors()]);
        }

        Dictionary::where('key','like',$key)->update([
            'value' => $request->value,
            'lang' => $request->lang,
        ]);

        return RequestsTrait::processResponse(true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($key)
    {
        //
        Dictionary::where('key','like',$key)->delete();
        return RequestsTrait::processResponse(true);
    }
}
