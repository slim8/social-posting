<?php

namespace App\Http\Extends;

use App\Http\Extends\HasOneOrMany;
use Illuminate\Database\Eloquent\Collection;

class ExtendedHasMany extends HasOneOrMany
{
    /**
     * Get the results of the relationship.
     *
     * @return mixed
     */
    public function getResults()
    {
        return !is_null($this->getParentKey())
                ? $this->query->get()
                : $this->related->newCollection();
    }

    /**
     * Initialize the relation on a set of models.
     *
     * @param array  $models
     * @param string $relation
     *
     * @return array
     */
    public function initRelation(array $models, $relation)
    {
        foreach ($models as $model) {
            $model->setRelation($relation, $this->related->newCollection());
        }

        return $models;
    }

    /**
     * Match the eagerly loaded results to their parents.
     *
     * @param array                                    $models
     * @param \Illuminate\Database\Eloquent\Collection $results
     * @param string                                   $relation
     *
     * @return array
     */
    public function match(array $models, Collection $results, $relation)
    {
        return $this->matchMany($models, $results, $relation);
    }
}
