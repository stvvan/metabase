/* eslint-disable react/prop-types */
import React from "react";
import { Box, Flex } from "grid-styled";
import { assocIn } from "icepick";
import { t } from "ttag";
import cx from "classnames";

import { color } from "metabase/lib/colors";

import CollectionEmptyState from "metabase/components/CollectionEmptyState";

import CollectionSectionHeading from "metabase/collections/components/CollectionSectionHeading";
import ItemTypeFilterBar, {
  FILTERS as ITEM_TYPE_FILTERS,
} from "metabase/collections/components/ItemTypeFilterBar";
import NormalItem from "metabase/collections/components/NormalItem";

import ItemDragSource from "metabase/containers/dnd/ItemDragSource";
import PinDropTarget from "metabase/containers/dnd/PinDropTarget";

import { ANALYTICS_CONTEXT } from "metabase/collections/constants";

export default function ItemList({
  items,
  collection,
  empty,
  selected,
  getIsSelected,
  onToggleSelected,
  onDrop,
  collectionHasPins,
  showFilters,
  onMove,
  onCopy,
  onFilterChange,
  filter,
}) {
  const everythingName =
    collectionHasPins && items.length > 0 ? t`Everything else` : t`Everything`;
  const filters = assocIn(ITEM_TYPE_FILTERS, [0, "name"], everythingName);

  const hasTopBorder = !collectionHasPins && !showFilters;

  return (
    <Box
      className={cx("relative", {
        "border-top": hasTopBorder,
      })}
    >
      {showFilters ? (
        <ItemTypeFilterBar
          analyticsContext={ANALYTICS_CONTEXT}
          filters={filters}
          filter={filter}
          onFilterChange={onFilterChange}
        />
      ) : (
        collectionHasPins &&
        items.length > 0 && (
          <CollectionSectionHeading>{t`Everything else`}</CollectionSectionHeading>
        )
      )}
      {items.length > 0 && (
        <PinDropTarget pinIndex={null} margin={8}>
          <Box>
            {items.map(item => (
              <Box
                key={`${item.id}_${item.model}`}
                className="relative"
                data-testid="collection-entry"
              >
                <ItemDragSource
                  item={item}
                  isSelected={getIsSelected(item)}
                  selected={selected}
                  onDrop={onDrop}
                  collection={collection}
                >
                  <NormalItem
                    key={`${item.model}:${item.id}`}
                    item={item}
                    onPin={() => item.setPinned(true)}
                    collection={collection}
                    isSelected={getIsSelected(item)}
                    selected={selected}
                    onToggleSelected={onToggleSelected}
                    onMove={onMove}
                    onCopy={onCopy}
                  />
                </ItemDragSource>
              </Box>
            ))}
          </Box>
        </PinDropTarget>
      )}
      {!collectionHasPins && !items.length > 0 && (
        <Box mt={"120px"}>
          <CollectionEmptyState />
        </Box>
      )}
      {empty && (
        <PinDropTarget pinIndex={null} hideUntilDrag margin={10}>
          {({ hovered }) => (
            <Flex
              align="center"
              justify="center"
              py={2}
              m={2}
              color={hovered ? color("brand") : color("text-medium")}
            >
              {t`Drag here to un-pin`}
            </Flex>
          )}
        </PinDropTarget>
      )}
    </Box>
  );
}
