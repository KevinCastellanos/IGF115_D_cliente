/**
 * Data source
 */
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy} from "@angular/cdk/scrolling";

const PAGESIZE = 25;
const ROW_HEIGHT = 48;

export class GridTableDataSource extends DataSource<any> {
    private _data: any[];

    get allData(): any[] {
        return this._data.slice();
    }

    set allData(data: any[]) {
        this._data = data;
        this.viewport.scrollToOffset(0);
        this.viewport.setTotalContentSize(this.itemSize * data.length);
        this.visibleData.next(this._data.slice(0, PAGESIZE));
    }

    offset = 0;
    offsetChange = new BehaviorSubject(0);
    constructor(initialData: any[], private viewport: CdkVirtualScrollViewport, private itemSize: number) {
        super();
        this._data = initialData;
        this.viewport.elementScrolled().subscribe((ev: any) => {
            const start = Math.floor(ev.currentTarget.scrollTop / ROW_HEIGHT);
            const prevExtraData = start > 5 ? 5 : 0;
            // const prevExtraData = 0;
            const slicedData = this._data.slice(start - prevExtraData, start + (PAGESIZE - prevExtraData));
            this.offset = ROW_HEIGHT * (start - prevExtraData);
            this.viewport.setRenderedContentOffset(this.offset);
            this.offsetChange.next(this.offset)
            this.visibleData.next(slicedData);
        });
    }

    private readonly visibleData: BehaviorSubject<any[]> = new BehaviorSubject([]);

    connect(collectionViewer: import('@angular/cdk/collections').CollectionViewer): Observable<any[] | ReadonlyArray<any>> {
        return this.visibleData;
    }

    disconnect(collectionViewer: import('@angular/cdk/collections').CollectionViewer): void {
    }
}

/**
 * Virtual Scroll Strategy
 */
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(ROW_HEIGHT, 1000, 2000);
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.onDataLengthChanged();
  }
}