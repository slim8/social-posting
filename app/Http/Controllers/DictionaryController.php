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
            

        if($validation->fails()){
            return RequestsTrait::processResponse(false , [ "error" => $validation->errors()]);
        }

        if(!$this->dictionaryValidate($request)){
            return RequestsTrait::processResponse(false , [ "error" => [ "key" => [ "key lang exist ." ], "lang" => [ "key lang exist."] ]]);
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

        $dictionary = Dictionary::where('key',$key);
        
        if($request->lang){
            $dictionary = $dictionary->where('lang' , $request->lang);
        }
        $dictionary = $dictionary->first();

        if(!$dictionary){
            return RequestsTrait::processResponse(false, ['message' => 'This key with provided Lang not found']);
        }

        return RequestsTrait::processResponse(true , [ "dictionary" => $dictionary]);
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
        $validation = Validator::make($request->all(), [
            'value' => 'required',
        ]);

        if($validation->fails()){
            return RequestsTrait::processResponse(false , ["error" => $validation->errors()]);
        }

        if(!$this->dictionaryValidate($request)){
            return RequestsTrait::processResponse(false , [ "error" => [ "key" => [ "key lang exist ." ], "lang" => [ "key lang exist."] ]]);
        }

        Dictionary::where('key',$key)->update([
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
        Dictionary::where('key',$key)->delete();
        return RequestsTrait::processResponse(true);
    }

    public function dictionaryValidate($request){
        $row = Dictionary::where('lang',$request->lang)->where('key',$request->key)->first();
        if($row){
            return false;
        }else{
            return true;
        }
    }
}
